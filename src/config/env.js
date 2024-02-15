/* Global imports */
const dotenv = require('dotenv');
const path = require('path');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

dotenv.config({
  path: path.resolve(__dirname, `../../env/.env.${process.env.NODE_ENV}`),
});

exports.ENV = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  API_ROUTES_V1: process.env.API_ROUTES_V1,
  CRYPTO_SECRET_KEY: process.env.CRYPTO_SECRET_KEY,
  CRYPTO_SECRET_IV: process.env.CRYPTO_SECRET_IV,
  CRYPTO_ECNRYPTION_METHOD: process.env.CRYPTO_ECNRYPTION_METHOD,
};
