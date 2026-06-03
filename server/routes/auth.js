const express = require('express');
const router = express.Router();
const { sendSmsCode, login, logout, checkAuth } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/sms', sendSmsCode);
router.post('/login', login);
router.post('/logout', auth, logout);
router.get('/check', auth, checkAuth);

module.exports = router;
