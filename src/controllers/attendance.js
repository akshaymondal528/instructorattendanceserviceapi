/* Global imports */
const moment = require('moment-timezone');

/* Local imports */
const {
  STATUSCODE,
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} = require('../utils/response');
const { currentDateTime } = require('../helpers/validator');
const { Attendance } = require('../models/attendance');

/**
 * @function checkIn
 * @description function to check-in
 * @param (req, res)
 * @method get
 * @author Akshay
 */
exports.checkIn = async (req, res) => {
  try {
    if (req.user.role !== 'Instructor')
      return clientErrorResponse(
        res,
        'Only instructor can check-in',
        STATUSCODE.FORBIDDEN
      );

    const lastCheckedOut = await Attendance.findOne({}, { check_out: 1 }).sort({
      createdAt: -1,
    });
    if (lastCheckedOut && !lastCheckedOut.check_out)
      return clientErrorResponse(res, 'Please check-out before check-in');

    const data = {
      instructor_id: req.user._id,
      date: moment().format('YYYY-MM-DD'),
      check_in: currentDateTime(),
    };
    await Attendance.create(data);

    return successResponse(req, res, 'Checked In');
  } catch (error) {
    return serverErrorResponse(req, res, error.message);
  }
};

/**
 * @function checkOut
 * @description function to check-out
 * @param (req, res)
 * @method get
 * @author Akshay
 */
exports.checkOut = async (req, res) => {
  try {
    if (req.user.role !== 'Instructor')
      return clientErrorResponse(
        res,
        'Only instructor can check-out',
        STATUSCODE.FORBIDDEN
      );

    const lastChecked = await Attendance.findOne(
      {},
      { check_in: 1, check_out: 1 }
    ).sort({
      createdAt: -1,
    });
    if (lastChecked && lastChecked.check_out)
      return clientErrorResponse(res, 'Please check-in before check-out');

    const checkIn = lastChecked.check_in;
    const checkOut = currentDateTime();
    const duration = moment(checkOut).diff(moment(checkIn), 'minutes');
    await Attendance.updateOne(
      { _id: lastChecked._id },
      { $set: { check_out: checkOut, duration: duration } }
    );

    return successResponse(req, res, 'Checked Out');
  } catch (error) {
    return serverErrorResponse(req, res, error.message);
  }
};
