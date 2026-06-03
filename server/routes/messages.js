const express = require('express');
const router = express.Router();
const {
  getMessageList,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createAppointment,
  getAppointmentList,
  updateAppointmentStatus
} = require('../controllers/messageController');
const { auth, agentAuth } = require('../middleware/auth');

router.get('/', auth, getMessageList);
router.get('/unread/count', auth, getUnreadCount);
router.put('/:id/read', auth, markAsRead);
router.put('/all/read', auth, markAllAsRead);
router.post('/appointment', auth, createAppointment);
router.get('/appointment/list', auth, getAppointmentList);
router.put('/appointment/status', agentAuth, updateAppointmentStatus);

module.exports = router;
