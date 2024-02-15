/* Global imports */
const router = require('express').Router();

/* Local imports */
const attendance = require('../controllers/attendance');

router.get('/attendance/checkin', attendance.checkIn); // Check-in instructors
router.get('/attendance/checkout', attendance.checkOut); // Check-out instructors

module.exports = router;
