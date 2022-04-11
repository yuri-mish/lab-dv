'use strict';

const http = require('http');

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./src/schemaSite/schema.js');
const { ErrorWithCode } = require('./errors');
const config = require('./src/config');
const cors = require('cors');
const { logger } = require('./src/logger.js');
const { print } = require('graphql');

const gqlLabel = config.logger.labels.gql;
const serverLabel = config.logger.labels.server;


const app = express();

app.disable('x-powered-by');
app.use(cors(config.server.cors));

app.get('/status', async(req, res) => {
  res.status(200).send({ status: 'OK' });
});

app.use(
  '/',
  graphqlHTTP(() => ({
    schema: schema,
    graphiql: true,
    extensions: ({ variables, document }) => {
      logger.debug(
        `Query: \n${print(document)}`,
        { variables, label: gqlLabel }
      );
    },

    customFormatErrorFn: (err) => {
      err.description = err.originalError?.description;
      err.code = err.originalError?.code;
      logger.error(err, { label: gqlLabel });
      return ErrorWithCode.codify(err.originalError).toObject();
    },
  }))
);

const wsServer = http.createServer(app);

wsServer.listen(config.serverSite.port, () => {
  logger.info(
    `Server now running on http://localhost:${config.serverSite.port}`,
    { label: gqlLabel }
  );
});

process.on('SIGTERM', () => {
  logger.info(
    `Got SIGTERM. Graceful shutdown start at ${new Date().toISOString()}`,
    { label: serverLabel }
  );
  global.processIsGoingDown = true;
  wsServer.close((err) => {
    if (err) {
      logger.error(err, { label: serverLabel });
      process.exitCode = 1;
    }
    process.exit();
  });
});
