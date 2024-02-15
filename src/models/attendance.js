/* Global imports */
const mongoose = require('mongoose');

/* Local imports */
const { currentDateTime } = require('../helpers/validator');

/* Attendance schema */
const attendanceSchema = new mongoose.Schema(
  {
    instructor_id: {
      type: mongoose.Types.ObjectId,
      ref: 'instructor',
      default: null,
    },
    date: {
      type: Date,
      default: null,
    },
    check_in: {
      type: Date,
      default: null,
    },
    check_out: {
      type: Date,
      default: null,
    },
    duration: {
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

exports.Attendance = mongoose.model('attendance', attendanceSchema);
