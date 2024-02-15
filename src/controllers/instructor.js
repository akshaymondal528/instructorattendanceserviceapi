/* Global imports */
const mongoose = require('mongoose');
const moment = require('moment-timezone');

/* Local imports */
const {
  STATUSCODE,
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} = require('../utils/response');
const { removeExtraSpace } = require('../helpers/validator');
const { encryptData } = require('../helpers/crypto');
const { Instructor } = require('../models/instructor');
const { Attendance } = require('../models/attendance');

/**
 * @function addInstructorValidation
 * @description function to vaidate add instructors
 * @param (data)
 * @author Akshay
 */
const addInstructorValidation = (data) => {
  if (Object.keys(data).length === 0)
    return { error: true, message: `Require instructor's data` };
  if (!data.name) return { error: true, message: `Require instructor's name` };
  if (!data.email)
    return { error: true, message: `Require instructor's email` };
  if (!data.mobile)
    return { error: true, message: `Require instructor's mobile` };
  if (!data.password)
    return { error: true, message: `Require instructor's password` };
  if (!data.specialization)
    return { error: true, message: `Require instructor's specialization` };

  return { error: false, message: '' };
};

/**
 * @function addInstructor
 * @description function to add instructors
 * @param (req, res)
 * @method post
 * @author Akshay
 */
exports.addInstructor = async (req, res) => {
  try {
    if (req.user.role !== 'Admin')
      return clientErrorResponse(
        res,
        'Only admin can add insturctor',
        STATUSCODE.FORBIDDEN
      );

    const validation = addInstructorValidation(req.body);
    if (validation.error) return clientErrorResponse(res, validation.message);

    const checkEmail = await Instructor.findOne(
      { email: req.body.email, is_deleted: false },
      { _id: 1 }
    );
    if (checkEmail) return clientErrorResponse(res, `Email already exist`);

    /* Encrypt password */
    const hashPassword = encryptData(req.body.password);
    req.body.name = removeExtraSpace(req.body.name);
    if (hashPassword) req.body.password = hashPassword;

    await Instructor.create(req.body);

    return successResponse(req, res, 'Instructor added');
  } catch (error) {
    return serverErrorResponse(req, res, error.message);
  }
};

/**
 * @function getAttendanceReport
 * @description function to get instructor attendance report (monthly/yearly)
 * @param (req, res)
 * @method post
 * @author Akshay
 */
exports.getAttendanceReport = async (req, res) => {
  try {
    if (req.user.role !== 'Admin')
      return clientErrorResponse(
        res,
        'Only admin get insturctor list',
        STATUSCODE.FORBIDDEN
      );

    const timeframe = req.query.timeframe ? req.query.timeframe : 'monthly';
    const aggpipe = [];
    aggpipe.push({
      $match: {
        is_deleted: false,
      },
    });

    if (
      req.body.instructor_id &&
      Array.isArray(req.body.instructor_id) &&
      req.body.instructor_id.length > 0
    ) {
      const instructorIds = req.body.instructor_id.map(
        (e) => new mongoose.Types.ObjectId(e)
      );
      aggpipe.push({
        $match: {
          instructor_id: {
            $in: instructorIds,
          },
        },
      });
    }

    if (req.body.checkin_from_date && req.body.checkin_to_date) {
      aggpipe.push({
        $match: {
          check_in: {
            $gte: new Date(
              moment(req.body.checkin_from_date).format('YYYY-MM-DD')
            ),
            $lte: new Date(
              moment(moment(req.body.checkin_to_date).add(1, 'day')).format(
                'YYYY-MM-DD'
              )
            ),
          },
        },
      });
    }

    aggpipe.push(
      {
        $project: {
          instructor_id: 1,
          duration: 1,
          timeframe: {
            $dateToString: {
              date: '$date',
              format: timeframe === 'yearly' ? '%Y' : '%Y-%m',
            },
          },
        },
      },
      {
        $group: {
          _id: {
            instructor_id: '$instructor_id',
            timeframe: '$timeframe',
          },
          total_minute_duration: {
            $sum: '$duration',
          },
        },
      },
      {
        $project: {
          _id: 0,
          instructor_id: '$_id.instructor_id',
          timeframe: '$_id.timeframe',
          total_minute_duration: 1,
        },
      },
      {
        $lookup: {
          from: 'instructors',
          let: {
            instructorID: '$instructor_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$instructorID'],
                },
              },
            },
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: 'instructor',
        },
      },
      {
        $addFields: {
          instructor: {
            $ifNull: [
              {
                $last: '$instructor.name',
              },
              '',
            ],
          },
        },
      },
      {
        $sort: {
          total_minute_duration: -1,
        },
      }
    );

    const attendance = await Attendance.aggregate(aggpipe);
    const result = await Promise.all(
      attendance.map(async (data) => {
        data.timeframe =
          timeframe === 'yearly'
            ? data.timeframe
            : moment(data.timeframe, 'YYYY-MM').format('MMMM, YYYY');
        return data;
      })
    );

    return successResponse(req, res, 'Attendance reports', false, result);
  } catch (error) {
    return serverErrorResponse(req, res, error.message);
  }
};
