/* Global imports */
const router = require('express').Router();

/* Local imports */
const instructor = require('../controllers/instructor');

router.post('/instructors', instructor.addInstructor); // Add/register instructors
router.post('/instructors/reports', instructor.getAttendanceReport); // Get attendance report

module.exports = router;
