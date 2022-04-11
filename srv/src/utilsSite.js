/* eslint-disable linebreak-style */
'use strict';
const config = require('./config');

const checkToken = (token) => {
  if (token) {
    const res = config.serverSite.tokens.find(el => token === el.token);
    if (res) return res;
  }
  return false;
};

module.exports = {
  checkToken: checkToken
};
