'use strict';

const config = require('../../config');
const Joi = require('joi');
const LiqPay = require('./lib/liqpay');
const QRCode = require('qrcode');
const dbf = require('../../db');
const { ErrorWithCode, errors } = require('../../../errors');

const liqpayOptionsSchema = Joi.object({
  type: Joi.string().valid('form', 'form_params', 'qrcode', 'link').required(),
  amount: Joi.number().required(),
  description: Joi.string().required(),
  orderId: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  redirectUrl: Joi.string().uri().allow(''),
  data: Joi.object({
    _id: Joi.string().required(),
    organization: Joi.string().required(),
    proj: Joi.string().uuid().required(),
  }).unknown().required(),
}).unknown();


const encodeBase64 = (data) => (
  Buffer.from(JSON.stringify(data)).toString('base64')
);

const decodeBase64 = (data) => (
  JSON.parse(Buffer.from(data, 'base64').toString())
);

const actionByType = {
  form: 'pay',
  form_params: 'pay',
  qrcode: 'payqr',
  link: 'payqr',
};

const prepareParams = (options) => ({
  action: actionByType[options.type],
  version: 3,
  currency: 'UAH',
  language: 'uk',
  description: options.description,
  amount: options.amount,
  order_id: options.orderId,
  result_url: options.redirectUrl,
  server_url: config.liqpay.postbackUrl,
  dae: options.data ? encodeBase64(options.data) : null,
});

const getPaymentData = async(keys, options) => {
  const key = keys.find((key) => key.proj === options.data.proj);
  if (!key) {
    throw new ErrorWithCode(errors.PAYMENT_METHON_NOT_AVAILABLE);
  }
  const liqpay = new LiqPay(key.public, key.private);
  const params = prepareParams(options);
  if (params.action === 'pay') {
    if (options.type === 'form') {
      return { form: liqpay.cnb_form(params) };
    } else if (options.type === 'form_params') {
      return {
        signature: liqpay.cnb_signature(params),
        data: encodeBase64(params),
        action: 'https://www.liqpay.ua/api/3/checkout',
      };
    }
  } else if (params.action === 'payqr') {
    const res = await new Promise((resolve, reject) => {
      liqpay.api('request', params, (res) => {
        res?.qr_code ? resolve(res?.qr_code) : reject(new Error(res.err_code));
      });
    });

    if (options.type === 'link') {
      return { link: res };
    } else if (options.type === 'qrcode') {
      const qrCode = await QRCode.toDataURL(res);
      return { qrcode: qrCode };
    }
  }
  throw new Error(`Unknown payment type '${options.type}'`);
};

const checkPostback = (req, privateKey) => {
  const liqpay = new LiqPay();
  return req.body?.signature ===
    liqpay.str_to_sign(privateKey + req.body?.data + privateKey);
};

const handlePostback = async(req) => {
  const paymentData = decodeBase64(req.body?.data);
  if (paymentData.status !== 'success') {
    throw new Error(`Payment error: ${paymentData?.err_code ?? 'unkown'}`);
  }
  let data;
  try {
    data = decodeBase64(paymentData.dae);
  } catch {
    throw new Error('Failed to parse dae');
  }
  const keys = await dbf.getPaymentConfig(data.organization, 'LiqPay')
    .then((res) => res?.keys);
  const key = keys.find((key) => key.proj === data.proj);
  if (!key) {
    throw new Error(
      `Missing keys for proj/organization: ${data.proj}/${data.organization}`
    );
  }
  if (!checkPostback(req, key.private)) {
    throw new Error('Fake postback');
  }

  return {
    paymentData,
    data,
  };
};

module.exports = {
  getPaymentData,
  handlePostback,
  checkPostback,
  liqpayOptionsSchema,
  encodeBase64,
  decodeBase64,
};

