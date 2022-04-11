'use strict';
require('dotenv').config();
const env = process.env;
const { formatPhoneNumber } = require('./helpers');

const POSTBACK_HOST = env.POSTBACK_HOST ?? env.BACKEND_GRAPHQL_HOST;

const config = {
  ver: {
    main: 1,
    sub: 0
  },
  db: {
    host: env.DB_HOST,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  },
  utp: {
    parentNomService: '7ab5cbd2-e9d8-11e9-810d-00155dcccf0a',
    blancketNom: '6d9fbce5-1d37-11e8-80c6-0e0b1ac00045',
    CO2Nom: 'ababfc74-9d0c-11eb-8a9b-00155d000b04',
    TahoNom: '8b9263ad-ff33-11ea-811a-00155da29310',
    httpServiceHost: env.SERVER1C_HOST || '1cweb.otk.in.ua',
    httpServicePath: env.SERVER1C_PATH || '/otk-base/hs/OTK',
    httpService: `https://${ env.SERVER1C_HOST }${env.SERVER1C_PATH}`,
  },
  couch: {
    host: env.COUCH_HOST,
    user: env.COUCH_USER,
    proto: env.COUCH_PROTO,
    password: env.COUCH_PASSWORD,
    db: {
      doc: env.COUCH_DB_DOC,
      cat: env.COUCH_DB_CAT,
    },
  },
  serverSite: {
    port: +env.SERVER_SITE_PORT || 4001,
    tokens: [ { token: '0123', src: 'widget' } ]
  },
  server: {
    port: +env.SERVER_PORT || 4000,
    cors: {
      allowedHeaders: [ 'token', 'Content-Type' ],
      exposedHeaders: [ 'token' ],
      credentials: true,
      origin: [
        'http://localhost:3000',
        /* laboratory */
        'https://otk.vioo.com.ua',
        'https://dev.otk.vioo.com.ua',
        'https://lab.otk.in.ua',
        'https://otk-lab-dev.web.app',
        'https://lab-stage.otk.in.ua',
        /^https:\/\/otk-lab-dev-.+\.web\.app$/,
        /* widget */
        'https://widget.otk.in.ua',
        'https://otk-widget-dev.web.app',
        'https://otk-widget.web.app',
        /^https:\/\/otk-widget-dev-.+\.web\.app$/,
      ],
    },
  },
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  },
  liqpay: {
    postbackRoute: env.LIQPAY_POSTBACK_ROUTE,
    postbackUrl: `${POSTBACK_HOST}${env.LIQPAY_POSTBACK_ROUTE}`,
  },
  yourls: {
    url: env.YOURLS_URL,
    signature: env.YOURLS_SIGNATURE,
  },
  turbosms: {
    sender: env.TURBOSMS_SENDER,
    token: env.TURBOSMS_TOKEN,
  },
  api: {
    opendatabot: {
      host: env.API_OPENDATABOT_HOST,
      apiKey: env.API_OPENDATABOT_KEY,
    },
  },
  jwt: {
    secret: env.JWT_SECRET || 'secret',
    algorithm: env.JWT_ALGORITHM || 'HS256',
    expire: +env.JWT_EXPIRE || 3800, // seconds
  },
  easypay: {
    sftpHost: env.EASYPAY_SFTP_HOST,
    sftpPort: env.EASYPAY_SFTP_PORT || 22,
    sftpLogin: env.EASYPAY_SFTP_LOGIN,
    sftpPassw: env.EASYPAY_SFTP_PASSW
  },
  gapi: {
    projectId: env.GAPI_PROJECTID || 'otk-lab',
    keyFile: env.GAPI_KEYFILENAME || 'otk-lab-google-key.json',
    path: env.GAPI_PATH || `${process.cwd() }/priv`,
    bucket: env.GAPI_BUCKET || 'otk-lab.appspot.com/expence-request'
  },
  gauth: {
    clientId: '86129307109-bivh3vb1ffbh6lhr0cvsgkslnlorseii.apps.googleusercontent.com',
    audience: [
      '86129307109-2ekvi9t4f41fj6a0qovg7u721erm1eu8.apps.googleusercontent.com',
      '86129307109-bivh3vb1ffbh6lhr0cvsgkslnlorseii.apps.googleusercontent.com',
    ],

  },
  telegram: {
    token: env.TELEGRAM_TOKEN || '12345:smokey',
    tokenDev: env.TELEGRAM_TOKEN_DEV,
    host: env.TELEGRAM_HOST || '',
  },
  env: env.NODE_ENV,
  cookieAttributes: env.COOKIE_ATTRIBUTES || '',
  callcenter: {
    phoneNumber: formatPhoneNumber('380676470202'),
    email: env.CALLCENTER_EMAIL,
  },
  orderNumberPrefix: env.ORDER_NUMBER_PREFIX,
  logger: {
    human: !!env.HUMAN_LOG,
    level: env.LOG_LEVEL || (env.NODE_ENV === 'dev' ? 'debug' : 'info'),
    labels: {
      gql: 'gql',
      server: 'server',
      order: 'order',
      partner: 'partner',
      tg: 'telegram',
      thirdParty: 'thirdparty',
      sheduler: 'sheduler',
    }
  }
};

module.exports = config;
