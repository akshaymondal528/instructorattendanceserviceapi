/* Global imports */
const mongoose = require('mongoose');

/* Local imports */
const { currentDateTime } = require('../helpers/validator');

/* Leave schema */
const leaveSchema = new mongoose.Schema(
  {
    instructor_id: {
      type: mongoose.Types.ObjectId,
      ref: 'instructor',
      default: null,
    },
    leave_from_date: {
      type: Date,
      default: null,
    },
    leave_to_date: {
      type: Date,
      default: null,
    },
    leave_duration: {
      type: Number,
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

exports.Leave = mongoose.model('leave', leaveSchema);
