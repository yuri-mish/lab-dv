'use strict';

const { ErrorWithCode, errors } = require('../../errors');
const config = require('../config');
const { logger } = require('../logger');
const { couchDoc } = require('../couch');
const dbf = require('../db');
const {
  handlePostback: handleLiqpayPostback,
  liqpayOptionsSchema,
  getPaymentData: getLiqpayPaymentData,
} = require('./liqpay/payment');


const getPaymentData = async(paymentType, organization, options) => {
  if (!organization) {
    throw new ErrorWithCode(errors.VALIDATION_FAILED, 'Missing organization');
  }

  const keys = await dbf.getPaymentConfig(organization, paymentType)
    .then((res) => res?.keys);

  if (!keys) {
    throw new ErrorWithCode(errors.PAYMENT_METHON_NOT_AVAILABLE);
  }

  if (paymentType === 'LiqPay') {
    const { error } = liqpayOptionsSchema.validate(options);
    if (error) {
      throw new ErrorWithCode(
        errors.VALIDATION_FAILED,
        error.details.map((detail) => detail.message),
      );
    }
    return Promise.resolve(getLiqpayPaymentData(keys, options)
      .catch((error) => {
        logger.debug('Failed request for LiqPay payment data', {
          stack: error.stack,
          label: config.logger.labels.thirdParty,
        });
        throw ErrorWithCode.codify(error, errors.INTERNAL_ERROR);
      })
    );
  }

  throw new ErrorWithCode(errors.VALIDATION_FAILED, 'Wrong payment type');
};


const handlePostback = async(type, req, res) => {
  let result;
  let doc;
  try {
    if (type === 'LiqPay') {
      result = await handleLiqpayPostback(req);
    }
    // Update payment info in order
    const _id = result.data?._id;
    if (!_id) {
      throw new Error('Missing _id');
    }
    doc = await dbf.getJsbDocById(_id).then((res) => res.rows?.[0]?.jsb);
    if (!doc) {
      throw new Error(`Doc does not exist (_id: ${_id})`);
    }
    if (doc.ext_json?.payments) {
      doc.ext_json.payments.push(result);
    } else {
      doc.ext_json.payments = [ result ];
    }
    await couchDoc.insert(doc).catch(() => {
      throw new Error('Failed to update doc');
    });

    logger.info(`Payment data changed (order: ${doc._id}`, {
      label: config.logger.labels.order,
      payments: doc.ext_json.payments,
    });
    res.sendStatus(200);
  } catch (err) {
    logger.error('Failed to update payment data', {
      stack: err.stack,
      label: config.logger.labels.order,
      data: result ?? {},
      req_body: req?.body,
    });
    res.sendStatus(400);
  }
};

module.exports = {
  getPaymentData,
  handlePostback,
};
