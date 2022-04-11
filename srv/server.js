'use strict';

const http = require('http');
const https = require('https');
const express = require('express');
const promBundle = require('express-prom-bundle');
const { graphqlHTTP } = require('express-graphql');
const { execute, subscribe, print } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const cors = require('cors');
const schema = require('./src/schema/schema.js');
const users = require('./src/data/users');
const { parseCookies } = require('./src/utils');
const { ErrorWithCode } = require('./errors');
const config = require('./src/config');
const tg = require('./src/bot/tg');
const jwt = require('./src/jwt.js');
const { checkLabReports } = require('./src/schema/messages.js');
const { logger } = require('./src/logger.js');
const { roledecode, checkCouchUser } = require('./src/auth.js');
const { handlePostback } = require('./src/payment/payment.js');
const pubsub = require('./src/schema/pubsub.js');
const { v4: uuid_v4 } = require('uuid');
const { couchCat } = require('./src/couch.js');
const dayjs = require('dayjs');
const { sendFileEasyPay, connectSFTP, endSFTP } = require('./src/payment/easypay.js');
const Client = require('ssh2-sftp-client');

const app = express();

app.use(express.json());

app.disable('x-powered-by');

app.use(cors(config.server.cors));

app.get('/set-cookie', (req, res) => {
  res.cookie('token=', '12345ABCDE');
  res.send('Set Cookie');
});

app.use(async(req, res, next) => {
  const token = parseCookies(req).token || '';
  console.log('token', token);
  if (!token) {
    next();
    return;
  }

  let result = await jwt.verify(token);
  if (result.error) {
    next();
    return;
  }

  const jwtUser = result.data;
  let user = users.findByName(jwtUser?.name);

  if (!user && jwtUser) {
    const couchUser = await checkCouchUser(jwtUser?.name);
    if (!couchUser || couchUser?._deleted) {
      next();
      return;
    }
    const { branch, ref, branches, isAdmin, roles } = roledecode(couchUser);
    user = { ...jwtUser, branch, ref, branches, isAdmin, roles };
    users.add(user);
  }

  req.currUser = user;
  result = await jwt.sign(jwtUser);

  if (result.error) {
    console.error(
      'Failed to generate JWT token with new expiration date',
      result.error
    );
  } else {
    res.setHeader('Set-Cookie', [ `token=${result.token};Path=/;Max-age=3800` ]);
  }
  next();
});

const Server1C = config.utp.httpService;

app.use(
  promBundle({
    includePath: true,
    metricsPath: '/status',
    promClient: {
      collectDefaultMetrics: {},
    },
  })
);

app.post('/bot', async(req, res) => {
  if (req.body.callback_query) {
    tg.callBackHandler(req);
  }

  if (req.body.message) {
    tg.messageHandler(req.body.message);
  }

  res.status(200).send({});
});

app.post('/sendBot', async(req, res) => {
  tg.bot.sendMessage(req.body.chatid, req.body.tMessage, {
    parse_mode: 'html',
  });
  res.status(200).send({});
});

app.post('/easypay_callback', async(req, res) => {

  couchCat.insert({
    _id: `cat.easypayLog|${uuid_v4()}`,
    date: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    class_name: 'cat.easypayLog',
    body: req?.body,
    sign: req.headers?.sign
  });
  pubsub.publish('EASYPAY_CALLBACK', req.body);
  res.status(200).send();
});

app.post('/easypay_sendftp', async(req, res) => {
  if ( !req.body ||
      !req.body.fileName ||
      !req.body.data) {
    res.status(300).send({ err: 'некорректные данные' });
    return;
  }

  const body = req.body;
  const data = body.data;
  const fileName = body.fileName;
  const dir = body?.dirName;

  //используем так , поскольку клиент sftp не поддерживает мултиконнектность
  const sftp = new Client();
  const connect = await connectSFTP(sftp);

  const retValue = {};
  if (connect?.err) {
    retValue.err = connect.err;
  } else {
    const result = await sendFileEasyPay({ sftp, dir, fileName, data });
    if (result?.err) {
      retValue.err = result.err;
    } else {
      retValue.ok = true;
    }
  }
  res.status(200).send(retValue);
  await endSFTP(sftp);
});

app.get('/printform/:iddoc/:pform', async(req, res) => {
  const proxyOptions = {
    agent: false,
  };
  const { iddoc, pform } = req.params;
  const docType = pform === 'trs' ? 'blankorder' : 'buyers_order';
  const Param1C = `doc=${docType}&ref=${iddoc}&rep=${pform}`;
  console.log(`${Server1C}?${Param1C}`);
  const proxy = https.request(`${Server1C}?${Param1C}`, proxyOptions);

  req.pipe(proxy, { end: true });

  proxy.on('response', (proxiedres) => {
    res.writeHead(
      proxiedres.statusCode,
      proxiedres.statusMessage,
      proxiedres.headers
    );
    proxiedres.pipe(res, { end: true });
  });
  proxy.on('error', (err) => {
    const msg = 'Error on connecting to the webservice.';
    console.error(msg, err);
    res.status(500).send(msg);
  });
});

app.get('/printact/:iddoc/:pform', async(req, res) => {
  const proxyOptions = {
    agent: false,
  };
  const { iddoc, pform } = req.params;
  const Param1C = `doc=servise_selling&ref=${iddoc}&rep=${pform}`;
  const proxy = https.request(`${Server1C}?${Param1C}`, proxyOptions);

  req.pipe(proxy, { end: true });

  proxy.on('response', (proxiedres) => {
    res.writeHead(
      proxiedres.statusCode,
      proxiedres.statusMessage,
      proxiedres.headers
    );
    proxiedres.pipe(res, { end: true });
  });
});

// Liqpay postback
app.post(
  config.liqpay.postbackRoute,
  express.urlencoded({ extended: true }),
  (req, res) => handlePostback('LiqPay', req, res)
);

const gqlLabel = config.logger.labels.gql;

app.use(
  '/',
  graphqlHTTP(() => ({
    schema: schema,
    graphiql: true,

    extensions: ({ variables, document }) => {
      logger.debug(`Query: \n${print(document)}`, {
        variables,
        label: gqlLabel,
      });
    },

    customFormatErrorFn: (err) => {
      err.description = err.originalError?.description;
      err.code = err.originalError?.code;
      logger.error(err, { label: gqlLabel });
      return ErrorWithCode.codify(err.originalError, err).toObject();
    },
  }))
);

const wsServer = http.createServer(app);

wsServer.listen(config.server.port, () => {
  console.log(
    `wsGraphQL Server is now running on http://localhost:${config.server.port}`
  );
  checkLabReports();

  // Set up the WebSocket for handling GraphQL subscriptions.
  SubscriptionServer.create(
    {
      execute,
      subscribe,
      schema,
      onConnect(connectionParams) {

        return { connectionParams };

      },
    },
    { server: wsServer, path: '/ws' }
  );
});

process.on('SIGTERM', () => {
  console.info(
    'Got SIGTERM. Graceful shutdown start at',
    new Date().toISOString()
  );
  global.processIsGoingDown = true;
  wsServer.close((err) => {
    if (err) {
      console.error(err);
      process.exitCode = 1;
    }
    process.exit();
  });
});
