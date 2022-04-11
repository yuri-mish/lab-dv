'use strict';

const jwt = require('jsonwebtoken');
const config = require('./config');

class JWT {
  constructor() {
    this.config = config.jwt;
    this.secret = this.config.secret;
    this.algorithm = this.config.algorithm;
    this.expiresIn = this.config.expire * 1000;
  }

  async sign(data) {
    return new Promise((resolve) => {
      const opts = { algorithm: this.algorithm, expiresIn: this.expiresIn };
      jwt.sign({ data }, this.secret, opts, (error, token) => {
        if (error) resolve({ error });
        else resolve({ error: null, token });
      });
    });
  }

  async verify(token) {
    return new Promise((resolve) => {
      const opts = { algorithms: [ this.algorithm ] };
      jwt.verify(token, this.secret, opts, (error, decoded) => {
        if (error) resolve({ error });
        else resolve({ error: null, data: decoded && decoded.data });
      });
    });
  }

  static create() {
    return new JWT();
  }
}

module.exports = JWT.create();
