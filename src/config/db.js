/* Global imports */
const mongoose = require('mongoose');

/* Local imports */
const { ENV } = require('./env');

/**
 * @function connectDB
 * @description function to connect database
 * @author Akshay
 */
exports.connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    return true;
  } catch (error) {
    return false;
  }
};
