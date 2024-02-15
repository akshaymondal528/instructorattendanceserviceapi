/* Global imports */
const mongoose = require('mongoose');

/* Local imports */
const { currentDateTime } = require('../helpers/validator');

/* Auth key schema */
const authKeySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      default: null,
    },
    instructor_id: {
      type: mongoose.Types.ObjectId,
      ref: 'instructor',
      default: null,
    },
    last_login: {
      type: Date,
      default: null,
    },
    auth_key: {
      type: String,
      default: '',
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

exports.AuthKey = mongoose.model('authkey', authKeySchema);
