/* Global imports */
const moment = require('moment-timezone');

/* Local imports */
const {
  STATUSCODE,
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} = require('../utils/response');
const { Holiday } = require('../models/holiday');
const { Leave } = require('../models/leave');

/**
 * @function applyLeaveValidation
 * @description function to vaidate apply leaves
 * @param (data)
 * @author Akshay
 */
const applyLeaveValidation = (data) => {
  if (Object.keys(data).length === 0)
    return { error: true, message: `Require leaves data` };
  if (!data.leave_from_date)
    return { error: true, message: `Require leave from date` };
  if (!data.leave_to_date)
    return { error: true, message: `Require leave to date` };

  return { error: false, message: '' };
};

/**
 * @function applyLeave
 * @description function to apply leaves
 * @param (req, res)
 * @method post
 * @author Akshay
 */
exports.applyLeave = async (req, res) => {
  try {
    if (req.user.role !== 'Instructor')
      return clientErrorResponse(
        res,
        'Only instructor can apply leaves',
        STATUSCODE.FORBIDDEN
      );

    const validation = applyLeaveValidation(req.body);
    if (validation.error) return clientErrorResponse(res, validation.message);

    const checkExistingLeave = await Leave.countDocuments({
      instructor_id: req.user._id,
      leave_to_date: { $gte: new Date(req.body.leave_from_date) },
    });
    if (checkExistingLeave > 0)
      return clientErrorResponse(res, 'Leave aleady applied on this range');

    req.body.instructor_id = req.user._id;
    const startDate = moment(req.body.leave_from_date);
    const endDate = moment(req.body.leave_to_date);
    const appliedLeaves = endDate.diff(startDate, 'days') + 1;

    let weekends = 0;
    while (startDate.isSameOrBefore(endDate)) {
      if (startDate.weekday() === 0 || startDate.weekday() === 6) weekends++;
      startDate.add(1, 'day');
    }

    const holidays = await Holiday.countDocuments({
      date: {
        $gte: new Date(req.body.leave_from_date),
        $lte: new Date(req.body.leave_to_date),
      },
    });

    const applicableLeavesDays = appliedLeaves - weekends - holidays;
    const leaveDuration = applicableLeavesDays * 8 * 60;
    req.body.leave_duration = leaveDuration;

    await Leave.create(req.body);

    return successResponse(req, res, 'Leaves applied');
  } catch (error) {
    return serverErrorResponse(req, res, error.message);
  }
};
