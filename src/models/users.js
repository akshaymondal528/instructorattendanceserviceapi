/* Global imports */
const mongoose = require('mongoose');

/* Local imports */
const { currentDateTime } = require('../helpers/validator');

/* User schema */
const userSchema = new mongoose.Schema(
  {
    user_type: {
      type: String,
      default: 'Admin',
    },
    name: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      default: '',
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { currentTime: currentDateTime },
    versionKey: false,
  }
);

exports.User = mongoose.model('user', userSchema);
