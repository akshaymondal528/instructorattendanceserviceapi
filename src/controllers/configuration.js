/* Local imports */
const {
  STATUSCODE,
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} = require('../utils/response');
const { Holiday } = require('../models/holiday');

/**
 * @function addHolidayValidation
 * @description function to vaidate add holiday
 * @param (data)
 * @author Akshay
 */
const addHolidayValidation = (data) => {
  if (Object.keys(data).length === 0)
    return { error: true, message: `Require holiday data` };
  if (!data.year) return { error: true, message: `Require holiday year` };
  if (
    !data.holidays ||
    !Array.isArray(data.holidays) ||
    data.holidays.length === 0
  )
    return { error: true, message: `Require holiday data` };
  let flag = true;
  let msg = '';
  for (const d of data.holidays) {
    if (!d.date || d.date === '') {
      flag = false;
      msg = 'Require holiday dates';
      break;
    } else if (!d.event || d.event === '') {
      flag = false;
      msg = 'Require holiday event name';
      break;
    }
  }
  if (!flag) return { error: true, message: msg };

  return { error: false, message: '' };
};

/**
 * @function addHoliday
 * @description function to add instituttion holiday
 * @param (req, res)
 * @method post
 * @author Akshay
 */
exports.addHoliday = async (req, res) => {
  try {
    if (req.user.role !== 'Admin')
      return clientErrorResponse(
        res,
        'Only admin can add holidays',
        STATUSCODE.FORBIDDEN
      );

    const validation = addHolidayValidation(req.body);
    if (validation.error) return clientErrorResponse(res, validation.message);

    for await (const data of req.body.holidays) {
      data.year = req.body.year;
      await Holiday.create(data);
    }

    return successResponse(req, res, 'Holidays added');
  } catch (error) {
    return serverErrorResponse(req, res, error.message);
  }
};
