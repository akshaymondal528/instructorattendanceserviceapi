/* Global imports */
const mongoose = require('mongoose');

/* Local imports */
const { currentDateTime } = require('../helpers/validator');

/* Instructor schema */
const instructorSchema = new mongoose.Schema(
  {
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
    specialization: {
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

exports.Instructor = mongoose.model('instructor', instructorSchema);
