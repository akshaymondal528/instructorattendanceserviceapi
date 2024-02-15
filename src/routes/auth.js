/* Global imports */
const router = require('express').Router();

/* Local imports */
const auth = require('../controllers/auth');

router.post('/users', auth.addUser); // Add/register users (Admin)
router.post('/users/login', auth.loginUser); // Login users (Admin)

router.post('/instructors/login', auth.loginInstructor); // Login instructors

module.exports = router;
