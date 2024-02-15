/* Global imports */
const router = require('express').Router();

/* Local imports */
const leave = require('../controllers/leave');

router.post('/leaves', leave.applyLeave); // Apply leaves

module.exports = router;
