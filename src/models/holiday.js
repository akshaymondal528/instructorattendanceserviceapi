/* Global imports */
const mongoose = require('mongoose');

/* Local imports */
const { currentDateTime } = require('../helpers/validator');

/* Holiday schema */
const holidaySchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      default: null,
    },
    event: {
      type: String,
      default: null,
    },
    date: {
      type: Date,
      default: null,
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

exports.Holiday = mongoose.model('holiday', holidaySchema);
