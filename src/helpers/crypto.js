/* Global imports */
const crypto = require('crypto');

/* Local imports */
const { ENV } = require('../config/env.js');

/* Generate secret hash with crypto to use for encryption */
const encryptionKey = crypto
  .createHash('sha512')
  .update(ENV.CRYPTO_SECRET_KEY)
  .digest('hex')
  .substring(0, 32);
const encryptionIV = crypto
  .createHash('sha512')
  .update(ENV.CRYPTO_SECRET_IV)
  .digest('hex')
  .substring(0, 16);

/**
 * @function encryptData
 * @description function to return encripted data
 * @param (data)
 * @author Akshay
 */
exports.encryptData = (data) => {
  try {
    const cipher = crypto.createCipheriv(
      ENV.CRYPTO_ECNRYPTION_METHOD,
      encryptionKey,
      encryptionIV
    );
    return Buffer.from(
      cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64');
  } catch (error) {
    return false;
  }
};

/**
 * @function decryptData
 * @description function to return decrypt data
 * @param (data)
 * @author Akshay
 */
exports.decryptData = (data) => {
  try {
    const buff = Buffer.from(data, 'base64');
    const decipher = crypto.createDecipheriv(
      ENV.CRYPTO_ECNRYPTION_METHOD,
      encryptionKey,
      encryptionIV
    );
    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    );
  } catch (error) {
    return false;
  }
};
