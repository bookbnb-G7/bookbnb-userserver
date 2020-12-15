const { createLogger, format, transports } = require('winston')

let date = new Date();
let filedate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();

module.exports = createLogger({
  format: format.combine(
    format.simple(),
    format.timestamp(),
    format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.File({
      maxsize: 10485760,
      maxfiles: 75,
      filename: `${__dirname}/../../logs/userserver-${filedate}.log`
    }),
    new transports.Console({
      level: 'debug'
    })
  ]
});
