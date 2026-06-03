const express = require('express');
const router = express.Router();
const { getUserInfo, updateUserInfo, submitAuth, getAuthStatus, switchRole } = require('../controllers/userController');
const { auth } = require('../middleware/auth');

router.get('/info', auth, getUserInfo);
router.put('/info', auth, updateUserInfo);
router.post('/auth', auth, submitAuth);
router.get('/auth/status', auth, getAuthStatus);
router.post('/role', auth, switchRole);

module.exports = router;
