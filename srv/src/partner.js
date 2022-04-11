/* eslint-disable no-unused-vars */
'use strict';

const { v4: uuid_v4 } = require('uuid');
const dbf = require('./db');
const { couchCat } = require('./couch');
const { getOpendatabotInfo, findValue } = require('./utils');
const { logger } = require('./logger');
const config = require('./config');

const getODBPartnerByEdrpou = async(edrpou) => {
  const ODBResult = await getOpendatabotInfo(edrpou);
  if (!(ODBResult && ODBResult.full_name)) {
    throw new Error('Partner does not exist in opendatabot');
  }

  const inn = findValue(ODBResult, 'pdv')?.[0]?.number ||
    ODBResult?.pdv_code || '';

  const ref = uuid_v4();
  const className = 'cat.partners';
  const partner = {
    _id: `${className}|${ref}`,
    class_name: className,
    ref,
    name: ODBResult.short_name || ODBResult.full_name,
    name_full: ODBResult.full_name,
    is_buyer: true,
    individual_legal: edrpou.length === 10 ?
      'ФизЛицо' : 'ЮрЛицо',
    inn,
    edrpou,
    note: JSON.stringify(ODBResult),
  };

  return partner;
};

const createNewPartner = async(partner) => {
  await couchCat.insert(partner);
  logger.info(
    'Partner was successfully created',
    { partner, label: config.logger.labels.partner }
  );
};

const getPartnerRefByEdrpou = async(edrpou) => {
  const dbResult = await dbf.getPartnerByEdrpou(edrpou);
  const ref = dbResult.rows?.[0]?.ref;
  if (!ref) {
    throw new Error('Partner does not exist');
  }

  return ref;
};

const getPartnerRefByPhoneNumber = async(phoneNumber) => {
  const dbResult = await dbf.getPartnerByPhoneNumber(phoneNumber);
  const ref = dbResult.rows?.[0]?.ref;
  if (!ref) {
    throw new Error('Partner does not exist');
  }

  return ref;
};

const getPartnerRefOrCreateNewOnFail = async(edrpou, data) => {
  const partnerRef = await getPartnerRefByEdrpou(edrpou).catch(() => null);

  if (partnerRef) {
    return partnerRef;
  }

  const newPartner = {
    ...data,
    ...await getODBPartnerByEdrpou(edrpou),
  };

  await createNewPartner(newPartner).catch((e) => {
    throw new Error('Cannot create partner', e);
  });

  return newPartner.ref;
};

const buildIndividualPartner = (phoneNumber, data) => {
  if (!phoneNumber) {
    throw new Error('Cannot build individual partner: phone number required');
  }

  const ref = uuid_v4();
  const className = 'cat.partners';
  const partner = {
    _id: `${className}|${ref}`,
    class_name: className,
    ref,
    name: data?.name || '',
    name_full: data?.name || data?.name_full || '',
    is_buyer: true,
    individual_legal: 'ФизЛицо',
    edrpou: '',
    note: data?.note || '',
    phones: String(phoneNumber),
  };

  return partner;
};

const getIndividualPartnerRefOrCreateNewOnFail = async(phoneNumber, data) => {
  const partnerRef = await getPartnerRefByPhoneNumber(phoneNumber)
    .catch(() => null);

  if (partnerRef) {
    return partnerRef;
  }

  const newPartner = buildIndividualPartner(phoneNumber, data);

  await createNewPartner(newPartner).catch((e) => {
    throw new Error('Cannot create partner', e);
  });

  return newPartner.ref;
};

module.exports = {
  getODBPartnerByEdrpou,
  getPartnerRefByEdrpou,
  getPartnerRefByPhoneNumber,
  createNewPartner,
  getPartnerRefOrCreateNewOnFail,
  buildIndividualPartner,
  getIndividualPartnerRefOrCreateNewOnFail,
};
