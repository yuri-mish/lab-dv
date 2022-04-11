'use strict';
const { v4: uuid_v4 } = require('uuid');
const dayjs = require('dayjs');
const { couchShed } = require('./couch');
const { logger } = require('./logger');
const config = require('./config');

const CLASS_NAME = 'shed.appoint';

const sheduleSiteOrder = (order) => {
  const startDate = order.fine_time;
  const duration = 30;
  const endDate = dayjs(startDate).add(duration, 'minute').toISOString();
  const ref = uuid_v4();

  const sheduleObj = {
    _id: `${CLASS_NAME}|${ref}`,
    class_name: CLASS_NAME,
    ref,
    department: order.department,
    date: dayjs(order.fine_time).startOf('date').toISOString(),
    startDate,
    endDate,
    duration,
    allDay: false,
    note: 'Замовлення з віджету',
    source: 'wid',
    partner: {
      ref: order.partner,
    },
    buyers_order: {
      ref: order.ref,
    },
  };

  shedule(sheduleObj).catch(() => {
    logger.error(`Failed to shedule order ${order._id}`, {
      label: config.logger.labels.sheduler,
      sheduleObj
    });
  });
};

const shedule = (sheduleObj) => (
  couchShed.insert(sheduleObj).then(() => {
    logger.info('Event was successfully sheduled', {
      label: config.logger.labels.sheduler,
      sheduleObj,
    });
  })
);

module.exports = {
  sheduleSiteOrder,
};
