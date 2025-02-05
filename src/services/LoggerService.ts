import {createLogger, format, transports} from 'winston';

const loggerLevel = process.env.LOGGER_LEVEL;

export const getLogger = () => createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`+(info.splat!==undefined?`${info.splat}`:" "))
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new (transports.Console)({ level: loggerLevel }),
  ]
});

