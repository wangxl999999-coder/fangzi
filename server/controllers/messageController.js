const Message = require('../models/Message');
const Appointment = require('../models/Appointment');
const { success, error, pagination } = require('../utils/response');

const getMessageList = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, type } = req.query;
    
    const query = { receiverId: req.user.id };
    if (type) query.type = type;

    const total = await Message.countDocuments(query);
    const list = await Message.find(query)
      .populate('senderId', 'nickname avatar')
      .populate('houseId', 'title images price')
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    pagination(res, list, total, Number(page), Number(pageSize));
  } catch (err) {
    error(res, err.message);
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user.id,
      isRead: false
    });
    
    success(res, { count });
  } catch (err) {
    error(res, err.message);
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    await Message.findOneAndUpdate(
      { _id: id, receiverId: req.user.id },
      { isRead: true, readAt: new Date() }
    );

    success(res, null, '已标记为已读');
  } catch (err) {
    error(res, err.message);
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      { receiverId: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    success(res, null, '全部标记为已读');
  } catch (err) {
    error(res, err.message);
  }
};

const createAppointment = async (req, res) => {
  try {
    const { houseId, agentId, name, phone, date, time, remark } = req.body;

    const appointment = new Appointment({
      userId: req.user.id,
      houseId,
      agentId,
      name,
      phone,
      date,
      time,
      remark
    });
    await appointment.save();

    await Message.create({
      senderId: req.user.id,
      receiverId: agentId,
      type: 'appointment',
      title: '新的看房预约',
      content: `${name} 预约看房，时间：${date} ${time}`,
      houseId,
      appointmentId: appointment._id
    });

    success(res, appointment, '预约成功');
  } catch (err) {
    error(res, err.message);
  }
};

const getAppointmentList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, role } = req.query;
    
    const query = role === 'agent' ? { agentId: req.user.id } : { userId: req.user.id };

    const total = await Appointment.countDocuments(query);
    const list = await Appointment.find(query)
      .populate('houseId', 'title images price address')
      .populate('userId', 'nickname avatar phone')
      .populate('agentId', 'nickname avatar phone realName company')
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    pagination(res, list, total, Number(page), Number(pageSize));
  } catch (err) {
    error(res, err.message);
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id, status, cancelReason } = req.body;
    
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return error(res, '预约不存在');
    }

    appointment.status = status;
    if (cancelReason) appointment.cancelReason = cancelReason;
    await appointment.save();

    const messageContent = status === 'confirmed' 
      ? '您的看房预约已确认' 
      : status === 'cancelled' 
        ? `预约已取消，原因：${cancelReason || '无'}` 
        : '预约状态已更新';

    await Message.create({
      receiverId: appointment.userId,
      type: 'appointment',
      title: '预约状态更新',
      content: messageContent,
      appointmentId: appointment._id
    });

    success(res, appointment, '状态更新成功');
  } catch (err) {
    error(res, err.message);
  }
};

module.exports = {
  getMessageList,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createAppointment,
  getAppointmentList,
  updateAppointmentStatus
};
