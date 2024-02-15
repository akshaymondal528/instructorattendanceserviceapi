/* Global imports */
const router = require('express').Router();

/* Local imports */
const configuration = require('../controllers/configuration');

router.post('/configurations/holidays', configuration.addHoliday);

module.exports = router;
