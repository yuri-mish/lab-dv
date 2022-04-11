'use strict';

const fetch = require('node-fetch');
const lodash = require('lodash');
const crypto = require('crypto');
const config = require('./config');
const { logger } = require('./logger');

const getRefObj = (obj) => {
  if (!obj._id) return null;
  return obj._id.split('|')[1] || null;
};

const parseCookies = request => {
  const list = {};
  const cookies = request.headers.cookie;

  if (cookies) {
    cookies.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
  }
  return list;
};

const getInfoApi = async(args, context) => {

  // eslint-disable-next-line max-len
  const Param1C = `doc=${args.doc}&ref=${args.ref}&rep=${args.doc}&org=${context.currUser.organizations}`;
  const Server1C = config.utp.httpService;
  try {
    const resp = await fetch(`${Server1C }?${ Param1C}`);
    return resp.ok ? resp.json() : { ok: false };

  } catch (error) {
    console.error('Request 1C ', error);
    return { ok: false };
  }

};

const getOpendatabotInfo = async(kod) => {
  const { host, apiKey } = config.api.opendatabot;
  const req = kod.length === 8 ?
    `https://${host}/api/v2/fullcompany/${kod}?apiKey=${apiKey}&edr=true` :
    `https://${host}/api/v2/fop/${kod}?apiKey=${apiKey}&edr=true`;
  try {
    const resp = await fetch(req);
    if (!resp.ok) {
      logger.error(
        `Failed request to opendatabot: status: ${resp.status}, text:${resp.statusText}`,
        { stack: true, label: resp?.statusText },
      );
      return {
        ok: false,
        statusText: resp.statusText
      };
    }
    return resp.json();

  } catch (error) {
    logger.error(
      `Failed request to opendatabot for ${kod}`,
      { stack: error.stack, label: config.logger.labels.thirdParty },
    );
    return { ok: false };
  }
};

const loginCouch = async(name, password) => {
  const data = { name, password };
  const opts = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  try {
    const resp = await fetch(`${config.couch.proto}${config.couch.host}/_session`, opts);
    return resp.ok ? resp.json() : { ok: false };
  } catch (error) {
    console.error(`Request login couch for ${name}`, error);
    return { ok: false };
  }
};


const genToken = () => (
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15)
);

const genTokenExpiration = () => new Date(new Date().setHours(new Date().getHours() + 3));

const mergeObjects = lodash.merge;
const isEmptyValue = lodash.isEmpty;

const findValue = (obj, key) => {
  const seen = new Set();
  let active = [ obj ];
  while (active.length) {
    const new_active = [];
    const found = [];
    for (let i = 0; i < active.length; i++) {
      // eslint-disable-next-line no-loop-func
      Object.keys(active[i]).forEach((k) => {
        const x = active[i][k];
        if (k === key) {
          found.push(x);
        } else if (x && typeof x === 'object' && !seen.has(x)) {
          seen.add(x);
          new_active.push(x);
        }
      });
    }
    if (found.length) return found;
    active = new_active;
  }
  return null;
};

const getShortUrl = async(url, expiredTimestamp) => {
  try {
    const apiUrl = `${config.yourls.url}/yourls-api.php`;
    const signature = config.yourls.signature;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const params = new URLSearchParams();
    params.append('action', 'shorturl');
    params.append('format', 'json');
    params.append('url', url);
    if (expiredTimestamp) {
      const newSignature = crypto.createHash('md5')
        .update(String(expiredTimestamp) + signature)
        .digest('hex');
      params.append('signature', newSignature);
      params.append('timestamp', expiredTimestamp);
    } else {
      params.append('signature', signature);
    }

    const response = await fetch(`${apiUrl}?${params}`, options);
    const data = await response.json();
    const shortUrl = data?.shorturl;
    if (!shortUrl) {
      throw new Error(data?.message ?? 'Unknown error');
    }
    return shortUrl;
  } catch (error) {
    logger.error(
      `Failed to get short url for ${url}`,
      { stack: error.stack, label: config.logger.labels.thirdParty },
    );
    throw error;
  }
};

const sendSMS = async(text, recipients) => {
  const body = JSON.stringify({
    recipients,
    sms: {
      sender: config.turbosms.sender,
      text,
    },
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.turbosms.token}`,
    },
    body,
  };

  const response = await fetch(
    'https://api.turbosms.ua/message/send.json',
    options,
  );
  return response.json();
};

module.exports = {
  getRefObj,
  parseCookies,
  getOpendatabotInfo,
  loginCouch,
  genToken,
  genTokenExpiration,

  mergeObjects,
  isEmptyValue,
  getInfoApi,
  findValue,
  getShortUrl,
  sendSMS,
};
