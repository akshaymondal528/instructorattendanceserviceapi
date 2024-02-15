/* Local imports */
const { verifyJWTToken } = require('../helpers/jwt');
const { AuthKey } = require('../models/authKey');

/**
 * @function authenticateUser
 * @description function to authenticate user
 * @param (req, res, next)
 * @author Akshay
 */
exports.authenticateUser = async (req, res, next) => {
  try {
    const role = req.headers['role'];
    const userId = req.headers['userid'];
    const authorization = req.headers['authorization'];
    if (!role && !userId && !authorization)
      return res.status(401).json({ success: false, message: 'Invalid token' });

    const token = authorization.split('Bearer ').at(-1);
    const query = { auth_key: token };
    if (role === 'Instructor') {
      query.instructor_id = userId;
    } else {
      query.user_id = userId;
    }
    const checkUserToken = await AuthKey.findOne(query, { _id: 1 });
    if (!checkUserToken)
      return res.status(401).json({ success: false, message: 'Invalid token' });

    const decodedData = await verifyJWTToken(token);
    if (!decodedData)
      return res.status(401).json({ success: false, message: 'Invalid token' });

    req.user = decodedData;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
