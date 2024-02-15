/* Local imports */
const { ENV } = require('../config/env');
const { successLog, errorLog } = require('../helpers/logger');

/* Object to define status code */
exports.STATUSCODE = {
  OK: 200,
  BADREQUEST: 400,
  UNAUTH: 401,
  FORBIDDEN: 403,
  NOTFOUND: 404,
  SERVERERROR: 500,
};

/**
 * @function successResponse
 * @description function to return API success response
 * @author Akshay
 */
exports.successResponse = (req, res, message, cached = false, result = []) => {
  successLog(req.method, req.url);
  return res
    .status(this.STATUSCODE.OK)
    .json({ success: true, message, cached, result });
};

/**
 * @function clientErrorResponse
 * @description function to return API client error response
 * @author Akshay
 */
exports.clientErrorResponse = (
  res,
  message,
  statusCode = this.STATUSCODE.BADREQUEST
) => {
  return res.status(statusCode).json({ success: false, message });
};

/**
 * @function serverErrorResponse
 * @description function to return API server error response
 * @author Akshay
 */
exports.serverErrorResponse = (req, res, message) => {
  errorLog(req.method, req.url, message);
  if (ENV.NODE_ENV === 'production') message = 'Try again later!';
  return res
    .status(this.STATUSCODE.SERVERERROR)
    .json({ success: false, message });
};
