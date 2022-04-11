'use strict';

const fs = require('fs');
const mjml2html = require('mjml');
const nodemailer = require('nodemailer');

const { interpolate } = require('../helpers');
const config = require('../config');
const { logger } = require('../logger');

const requiredFields = [
  'short_order_number',
  'order_date',
  'date',
  'formated_phone_number',
  'order_amount',
  'lab_info',
  'services',
  'short_info_link',
];

const defaultMailObj = {
  person_name: '',
  inn: '',
  vehicle_no: '',
  trailer_no: '',
  email_info: '',
  payment_info: '',
};

const loadTemplate = (path) => mjml2html(
  fs.readFileSync(path).toString()
).html;


const template = loadTemplate(`${__dirname}/mail-template.mjml`);
const billTemplate = loadTemplate(`${__dirname}/order-bill-mail-template.mjml`);


const sendMail = async(data, mailBody, attachments) => {
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: false,
    auth: config.smtp.auth,
  });

  return transporter.sendMail({
    from: `<${config.smtp.auth.user}>`,
    to: data.to,
    subject: data.subject,
    html: mailBody,
    attachments
  })
    .catch((err) => {
      logger.error(err, { label: config.logger.labels.thirdParty });
      throw new Error('Failed to send email');
    });
};


const sendMailToCallCenter = async(mailData) => {
  const data = { ...defaultMailObj, ...mailData };
  try {
    data.preview = `Заявка на послуги (${data.services}) 
      от: ${data.formated_phone_number} 
      ${data.person_name ? `/ ${data.person_name}` : ''}`;
    data.email_info = data.email ? `E-mail: ${data.email}` : '';
    data.callcenter_phone = config.callcenter.phoneNumber;
    const mail = interpolate(template, data);
    data.subject = 'Заявка на послуги лабораторії';
    data.to = config.callcenter.email;
    const attachments = [ {
      filename: 'otklogo.png',
      path: `${__dirname}/otklogo.png`,
      cid: 'otklogo',
    } ];
    return sendMail(data, mail, attachments);
  } catch (err) {
    throw new Error(err);
  }
};

const sendMailToCustomer = async(mailData, email) => {
  const data = { ...defaultMailObj, ...mailData };
  try {
    data.preview = `Ви оформили заявку на послуги (${data.services})`;
    data.callcenter_phone = config.callcenter.phoneNumber;
    const mail = interpolate(template, data);
    data.subject = 'Заявка на послуги лабораторії';
    data.to = email;
    const attachments = [ {
      filename: 'otklogo.png',
      path: `${__dirname}/otklogo.png`,
      cid: 'otklogo',
    } ];
    return sendMail(data, mail, attachments);
  } catch (err) {
    throw new Error(err);
  }
};

const sendOrderBillMail = async(mailData, email) => {
  const data = { ...mailData };
  try {
    data.preview = `Рахунок на замовлення: ${data.short_order_id}`;
    data.callcenter_phone = config.callcenter.phoneNumber;
    data.bill_link = `https://api.otk.in.ua/printform/${data.order_ref}/inv`;
    const mail = interpolate(billTemplate, data);
    data.subject = 'Рахунок';
    data.to = email;
    const attachments = [ {
      filename: 'otklogo.png',
      path: `${__dirname}/otklogo.png`,
      cid: 'otklogo',
    } ];
    return sendMail(data, mail, attachments);
  } catch (err) {
    throw new Error(err);
  }
};

const validateMailData = (data) => (
  requiredFields.every((field) => Object.keys(data).includes(field))
);


module.exports = {
  sendMail,
  sendMailToCallCenter,
  sendMailToCustomer,
  sendOrderBillMail,
  validateMailData,
};
