/* Global imports */
const JWT = require('jsonwebtoken');

/* Local imports */
const { ENV } = require('../config/env');

/**
 * @function signJWTToken
 * @description function to create JWT token
 * @param (data)
 * @author Akshay
 */
exports.signJWTToken = async (data) => {
  try {
    const secretKey = ENV.JWT_SECRET_KEY;
    const token = JWT.sign(data, secretKey, { expiresIn: 24 * 60 * 60 });
    return token;
  } catch (error) {
    return false;
  }
};

/**
 * @function verifyJWTToken
 * @description function to verify JWT token
 * @param (token)
 * @author Akshay
 */
exports.verifyJWTToken = async (token) => {
  try {
    const secretKey = ENV.JWT_SECRET_KEY;
    const decode = JWT.verify(token, secretKey);
    return decode;
  } catch (error) {
    return false;
  }
};
