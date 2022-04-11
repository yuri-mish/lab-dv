'use strict';

const nano = require('nano');
const config = require('./config');

const couchUrl =
  `${config.couch.proto}${config.couch.user}:${config.couch.password}@${config.couch.host}`;

module.exports = {
  couchDoc: nano(couchUrl).use(config.couch.db.doc),
  couchCat: nano(couchUrl).use(config.couch.db.cat),
  couchShed: nano(couchUrl).use('otk_2_shed'),
  couchUsers: nano(couchUrl).use('_users'),
};
