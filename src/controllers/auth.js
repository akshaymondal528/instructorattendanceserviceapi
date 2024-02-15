/* Local imports */
const {
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} = require('../utils/response');
const { removeExtraSpace } = require('../helpers/validator');
const { encryptData, decryptData } = require('../helpers/crypto');
const { signJWTToken } = require('../helpers/jwt');
const { currentDateTime } = require('../helpers/validator');
const { User } = require('../models/users');
const { Instructor } = require('../models/instructor');
const { AuthKey } = require('../models/authKey');

/**
 * @function addUserValidation
 * @description function to vaidate add user
 * @param (data)
 * @author Akshay
 */
const addUserValidation = (data) => {
  if (Object.keys(data).length === 0)
    return { error: true, message: `Require user's data` };
  if (!data.user_type) return { error: true, message: `Require user's type` };
  if (!data.name) return { error: true, message: `Require user's name` };
  if (!data.email) return { error: true, message: `Require user's email` };
  if (!data.mobile) return { error: true, message: `Require user's mobile` };
  if (!data.password)
    return { error: true, message: `Require user's password` };

  return { error: false, message: '' };
};

/**
 * @function addUser
 * @description function to add users
 * @param (req, res)
 * @method post
 * @author Akshay
 */
exports.addUser = async (req, res) => {
  try {
    const validation = addUserValidation(req.body);
    if (validation.error) return clientErrorResponse(res, validation.message);

    const checkEmail = await User.findOne(
      { email: req.body.email, is_deleted: false },
      { _id: 1 }
    );
    if (checkEmail) return clientErrorResponse(res, `Email already exist`);

    /* Encrypt password */
    const hashPassword = encryptData(req.body.password);
    req.body.name = removeExtraSpace(req.body.name);
    if (hashPassword) req.body.password = hashPassword;

    await User.create(req.body);

    return successResponse(req, res, 'User added');
  } catch (error) {
    return serverErrorResponse(req, res, error.message);
  }
};

/**
 * @function loginUser
 * @description function to login users
 * @param (req, res)
 * @method post
 * @author Akshay
 */
exports.loginUser = async (req, res) => {
  try {
    if (!req.body.email)
      return clientErrorResponse(res, `Require user's email`);
    if (!req.body.password)
      return clientErrorResponse(res, `Require user's password`);

    /* Check email */
    const checkEmail = await User.findOne(
      { email: req.body.email, is_active: true, is_deleted: false },
      { user_type: 1, name: 1, password: 1 }
    );
    if (!checkEmail) return clientErrorResponse(res, 'Invalid email');

    /* Decrypt/check password */
    const decryptPassword = decryptData(checkEmail.password);
    if (req.body.password !== decryptPassword)
      return clientErrorResponse(res, 'Wrong password');

    const { _id, user_type, name } = checkEmail._doc;
    const role = user_type ? user_type : 'Admin';
    const data = { _id, role, name };
    const token = await signJWTToken(data);

    /* Store token and last login time */
    const authKey = await AuthKey.findOne({ user_id: _id }, { _id: 1 });
    if (authKey) {
      await AuthKey.updateOne(
        { _id: authKey._id },
        { $set: { last_login: currentDateTime(), auth_key: token } }
      );
    } else {
      await AuthKey.create({
        user_id: _id,
        last_login: currentDateTime(),
        auth_key: token,
      });
    }

    const result = { _id, role, name, token };

    return successResponse(req, res, 'Logged In', false, result);
  } catch (error) {
    return serverErrorResponse(req, res, error.message);
  }
};

/**
 * @function loginInstructor
 * @description function to login instructors
 * @param (req, res)
 * @method post
 * @author Akshay
 */
exports.loginInstructor = async (req, res) => {
  try {
    if (!req.body.email)
      return clientErrorResponse(res, `Require instructor's email`);
    if (!req.body.password)
      return clientErrorResponse(res, `Require instructor's password`);

    /* Check email */
    const checkEmail = await Instructor.findOne(
      { email: req.body.email, is_active: true, is_deleted: false },
      { name: 1, password: 1 }
    );
    if (!checkEmail) return clientErrorResponse(res, 'Invalid email');

    /* Decrypt/check password */
    const decryptPassword = decryptData(checkEmail.password);
    if (req.body.password !== decryptPassword)
      return clientErrorResponse(res, 'Wrong password');

    const { _id, name } = checkEmail._doc;
    const role = 'Instructor';
    const data = { _id, role, name };
    const token = await signJWTToken(data);

    /* Store token and last login time */
    const authKey = await AuthKey.findOne({ instructor_id: _id }, { _id: 1 });
    if (authKey) {
      await AuthKey.updateOne(
        { _id: authKey._id },
        { $set: { last_login: currentDateTime(), auth_key: token } }
      );
    } else {
      await AuthKey.create({
        instructor_id: _id,
        last_login: currentDateTime(),
        auth_key: token,
      });
    }

    const result = { _id, role, name, token };

    return successResponse(req, res, 'Logged In', false, result);
  } catch (error) {
    return serverErrorResponse(req, res, error.message);
  }
};
