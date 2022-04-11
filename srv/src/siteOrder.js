'use strict';

const { v4: uuid_v4 } = require('uuid');
const fetch = require('node-fetch');
const config = require('./config');
const {
  normalizeCarNumber,
  formatPhoneNumber,
  dontIndent,
  splitId
} = require('./helpers');
const dbf = require('./db');

const {
  validateMailData,
  sendMailToCallCenter,
  sendMailToCustomer,
  sendOrderBillMail
} = require('./mail/mail');
const {
  getPartnerRefOrCreateNewOnFail,
  getIndividualPartnerRefOrCreateNewOnFail,
} = require('./partner');
const { couchDoc } = require('./couch');
const { sendSMS, getShortUrl } = require('./utils');
const { logger } = require('./logger');
const Joi = require('joi');
const { ErrorWithCode, errors } = require('../errors');
const { sheduleSiteOrder } = require('./sheduler');

const orderLabel = config.logger.labels.order;
const tgLabel = config.logger.labels.tg;

const BILL_MAIL_DELAY = 60000;
const EMPTY_FIELD = '-';

const serviceSchema = Joi.object({
  gos_code: Joi.string().allow('').required(),
  nom: Joi.string().guid().required(),
  price: [ Joi.number(), Joi.string() ],
}).unknown().allow(null);

const orderSchema = Joi.object({
  date: Joi.date().iso().required(),
  order_date: Joi.date().iso().required(),
  person_type: Joi.string().valid('legal', 'individual').required(),
  payment_type: Joi.string().valid('cash', 'cashless', 'online').required(),
  inn: Joi.alternatives().conditional('person_type', {
    is: 'legal', then: Joi.string().min(8).required(), otherwise: Joi.any()
  }),
  person_name: Joi.string().allow('').required(),
  phone_number: Joi.string().length(12).regex(/^\d+$/),
  proj: Joi.string().guid(),
  email: Joi.string().allow(''),
  order_amount: Joi.alternatives().try(Joi.string(), Joi.number()).required(),

  lab_info: Joi.string().required(),
  services: Joi.string().required(),
  lab: Joi.object({
    _id: Joi.string().required(),
    department: Joi.string().guid().required(),
    organization: Joi.string().guid().required(),
  }).unknown(),
  vehicle_service: serviceSchema,
  trailer_service: serviceSchema,
  order_info_link: Joi.string(),
}).or('vehicle_service', 'trailer_service').unknown();

const validateOrderData = (orderData) => (
  orderSchema.validate(orderData)
);

const extendOrderData = async(orderData, order) => {
  const short_order_number = order.number_doc.replace(/\D+0+/g, '');
  const short_info_link = await getShortUrl(
    `${orderData.order_info_link}&order_id=${short_order_number}`
  ).catch(() => '');

  return {
    ...orderData,
    date: (new Date(orderData.date)).toLocaleDateString('uk'),
    order_date: (new Date(orderData.order_date)).toLocaleString('uk'),
    trailer_no: orderData?.trailer_service?.gos_code || EMPTY_FIELD,
    vehicle_no: orderData?.vehicle_service?.gos_code || EMPTY_FIELD,
    inn: orderData.inn || EMPTY_FIELD,
    formated_phone_number: formatPhoneNumber(orderData.phone_number),
    short_order_number,
    order_number: order.number_doc,
    order_id: order._id,
    order_ref: order.ref,
    short_info_link,
  };
};

const sendMail = (mailData) => {
  const orderPrefix = `Order: ${mailData.order_id}.`;
  if (validateMailData(mailData)) {
    if (mailData.email) {
      const mailStr = `(email: ${mailData.email})`;
      sendMailToCustomer(mailData, mailData.email).catch((err) => {
        logger.error(
          `${orderPrefix} Failed to send mail to customer${mailStr}`,
          { stack: err.stack, label: orderLabel }
        );
      });
      if (mailData.payment_type === 'cashless') {
        setTimeout(() => {
          sendOrderBillMail(mailData, mailData.email).catch((err) => {
            logger.error(
              `${orderPrefix} Failed to send bill info mail to customer${mailStr}`,
              { stack: err.stack, label: orderLabel }
            );
          });
        }, BILL_MAIL_DELAY);
      }

    }
    sendMailToCallCenter(mailData).catch((err) => {
      logger.error(
        `${orderPrefix} Failed to send mail to call center`,
        { stack: err.stack, label: orderLabel }
      );
    });
  } else {
    logger.error(
      `${orderPrefix} Invalid mail data.`,
      { mailData, label: orderLabel },
    );
  }
};

const sendMsgToTelegram = async(url, chatId, message) => {
  const body = JSON.stringify({
    chatid: chatId,
    tMessage: message,
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  };

  const response = await fetch(url, options);
  if (!response?.ok) {
    logger.error(
      `Failed to sent message to chat(${chatId})`,
      { label: tgLabel }
    );
  }
};

const buildTgMessage = (data) => (`
  \u2705<b> Замовлення: ${data.order_number}</b>
  • Дата і час замовлення: ${data.order_date}
  • Контактний телефон: ${data.formated_phone_number}
  • Iм'я замовника: ${data.person_name}
  • ЕДРПОУ: ${data.inn} 
  • Держ. номер авто: ${data.vehicle_no}
  • Замовляються послуги: ${data.services}
  • Лабораторія: ${data.lab_info}
  • Бажана дата отримання сервісу: ${data.date}
  • Сума замовлення: ${data.order_amount} грн
`);

const sendOrderMsgsToTelegram = (orderData) => (
  dbf.get_config('tg_bot').then((jsb) => {
    const tgMsg = buildTgMessage(orderData);
    jsb.rec?.forEach((rec) => {
      sendMsgToTelegram(jsb.api, rec, tgMsg);
    });
  }).catch((e) => {
    logger.error(
      `Order: ${orderData.order_number}. Failed to send messages to telegram`,
      { stack: e.stack, label: orderLabel }
    );
  })
);

const sendOrderInfoSMS = async(data) => {
  try {
    const text = `Ваше замовлення № ${data.short_order_number || ''} прийнято!
      Інфо за тел.: ${config.callcenter.phoneNumber}
      Дата запису: ${data.date}
      Деталі та маршрут тут: ${data.short_info_link}
    `;

    sendSMS(dontIndent(text), [ data.phone_number ]);
  } catch (err) {
    logger.error(
      `Order: ${data.order_id}. Failed to send sms to ${data.phone_number}`,
      { label: orderLabel },
    );
  }
};

const createOrderDoc = async(data) => {
  const organization = data.lab?.organization;
  if (!organization) {
    throw new Error('Missing organization');
  }

  const { ref: department } = splitId(data.lab?._id);
  if (!department) {
    throw new Error('Missing department');
  }

  const isLegal = data.person_type === 'legal';

  let partner;
  if (isLegal) {
    partner = await getPartnerRefOrCreateNewOnFail(
      data.inn,
      { phones: data.phone_number ?? '' }
    );
  } else {
    partner = await getIndividualPartnerRefOrCreateNewOnFail(
      data.phone_number,
      { name: data.person_name, note: 'Контрагент створений з колл-центру' }
    );
  }

  const rawServices = [ data.vehicle_service, data.trailer_service ]
    .filter((service) => !!service);

  if (rawServices.length === 0) {
    throw new Error('Missing services');
  }

  const services = rawServices.map((service, index) => ({
    ...service,
    nats: 0,
    quantity: 1,
    row: index + 1,
    amount: service?.price,
    gos_code: normalizeCarNumber(service.gos_code),
  }));

  const className = 'doc.buyers_order';

  const number_doc = await dbf.getNewDocNumber(
    className, '', config.orderNumberPrefix
  );

  const ref = uuid_v4();

  const order = {
    _id: `${className}|${ref}`,
    ref,
    class_name: className,
    organization,
    department,
    number_doc,
    date: data.order_date,
    fine_time: data.date,
    partner,
    services,
    doc_amount: data.order_amount,
    proj: data.proj,
    ClientPerson: data.person_name,
    ClientPersonPhone: data.phone_number,
    vat_included: true,
  };

  await couchDoc.insert(order);
  logger.info(
    `Order ${order._id} was successfully created`,
    { order, label: orderLabel },
  );
  return order;
};

const validateAndCreateOrder = async(data) => {
  const { error } = validateOrderData(data);
  if (error) {
    throw new ErrorWithCode(
      errors.VALIDATION_FAILED,
      error.details.map((detail) => detail.message),
    );
  }
  return createOrder(data)
    .catch((err) => ErrorWithCode.codify(err, errors.INTERNAL_ERROR));
};

const createOrder = async(data) => {
  const orderData = { ...data };
  const order = await createOrderDoc(orderData).catch((err) => {
    logger.error(
      'Failed to create order',
      { stack: err.stack, label: orderLabel, orderData }
    );
    throw err;
  });

  const extendedOrderData = await extendOrderData(orderData, order);
  try {
    sheduleSiteOrder(order);
    sendMail(extendedOrderData);
    sendOrderMsgsToTelegram(extendedOrderData);
    sendOrderInfoSMS(extendedOrderData);
  } catch (err) {
    logger.error(err);
  }

  return {
    ...order,
    short_order_number: extendedOrderData.short_order_number,
  };
};

module.exports = {
  createOrder,
  validateOrderData,
  validateAndCreateOrder,
};

