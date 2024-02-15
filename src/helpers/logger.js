/* Global imports */
const fs = require('fs');
const moment = require('moment-timezone');

/**
 * @function successLog
 * @description function to create error logs
 * @author Akshay
 */
exports.successLog = (method, url) => {
  const filePath = 'logs/success.log';
  const successLog = `${moment()} [ ${method} ] [ ${url} ]\n`;
  if (fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, successLog);
  } else {
    fs.writeFileSync(filePath, successLog);
  }
};

/**
 * @function errorLogs
 * @description function to create error logs
 * @author Akshay
 */
exports.errorLog = (method, url, message) => {
  const filePath = 'logs/error.log';
  const errorLog = `${moment()} [ ${method} ] [ ${url} ] ${message}\n`;
  if (fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, errorLog);
  } else {
    fs.writeFileSync(filePath, errorLog);
  }
};
