const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const psw = require('../middleware/password-strength');

// Routes
router.post('/signup', psw, userCtrl.signup);
router.post('/login', psw, userCtrl.login);
// -----------------------------------------------

module.exports = router;