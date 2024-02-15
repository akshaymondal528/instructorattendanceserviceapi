/* Global imports */
const router = require('express').Router();

/* Local imports */
const { ENV } = require('../config/env');
const { authenticateUser } = require('../middlewares/auth');

const apiPrefix = ENV.API_ROUTES_V1; // API prefix

router.use(apiPrefix, require('./auth')); // Instructor auth (register, login) routes
router.use(apiPrefix, authenticateUser, require('./configuration')); // Configuration routes
router.use(apiPrefix, authenticateUser, require('./instructor')); // Instructor routes
router.use(apiPrefix, authenticateUser, require('./attendance')); // Attendance routes
router.use(apiPrefix, authenticateUser, require('./leave')); // Leave routes

module.exports = router;
