'use strict';

const winston = require('winston');
const config = require('./config');
const { format, transports } = winston;


const devLogFormat = format.printf((info) => {
  let meta;
  try {
    meta = JSON.stringify(info?.metadata, null, 2);
  } finally {
    meta = (meta === '{}' ? '' : `\n${meta}`);
  }
  const label = info?.label ? ` [${info.label}]` : '';
  const err = info?.stack ? `\n${info.stack}` : '';
  const msg = `${info.level}${label}: ${info.message}${err}${meta}`;
  return msg;
});

const logger = winston.createLogger({
  level: config.logger.level,
  format: format.combine(
    format.errors({ stack: true }),
    format.metadata({ fillExcept: [ 'message', 'level', 'stack', 'label' ] }),
    format.timestamp(),
  ),
  transports: [
    new transports.Console({
      handleExceptions: true,
      format: config.logger.human ?
        format.combine(format.align(), format.colorize(), devLogFormat) :
        format.combine(format.json())
    }),
  ],
});

module.exports = {
  logger,
};
