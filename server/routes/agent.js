const express = require('express');
const router = express.Router();
const { success, error } = require('../utils/response');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const House = require('../models/House');
const Message = require('../models/Message');

const sendSmsCode = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return error(res, '请输入手机号', 400);
    }
    console.log(`发送验证码到 ${phone}: 123456`);
    success(res, null, '验证码已发送');
  } catch (err) {
    error(res, err.message);
  }
};

const login = async (req, res) => {
  try {
    const { phone, code, role } = req.body;
    if (!phone || !code) {
      return error(res, '手机号和验证码不能为空', 400);
    }
    if (code !== '123456') {
      return error(res, '验证码错误', 400);
    }

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({
        phone,
        nickname: `经纪人${phone.slice(-4)}`,
        role: role === 'agent' ? 'agent' : 'user',
        authStatus: 'pending'
      });
      await user.save();
    } else if (user.role !== 'agent') {
      user.role = 'agent';
      await user.save();
    }

    const token = 'mock_agent_token_' + user._id;
    success(res, {
      token,
      user: {
        _id: user._id,
        phone: user.phone,
        nickname: user.nickname,
        realName: user.realName,
        role: user.role,
        authStatus: user.authStatus,
        avatar: user.avatar
      }
    }, '登录成功');
  } catch (err) {
    error(res, err.message);
  }
};

const submitAuth = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    if (!userId) {
      return error(res, '请先登录', 401);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        realName: req.body.realName,
        idCard: req.body.idCard,
        idCardFront: req.body.idCardFront,
        idCardBack: req.body.idCardBack,
        company: req.body.company,
        certificateNo: req.body.certificateNo,
        qualification: req.body.qualification,
        authStatus: 'pending'
      },
      { new: true }
    );

    if (!user) {
      return error(res, '用户不存在', 404);
    }

    success(res, null, '认证提交成功，等待审核');
  } catch (err) {
    error(res, err.message);
  }
};

const getAuthStatus = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    if (!userId) {
      return success(res, { status: 'none' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return success(res, { status: 'none' });
    }

    success(res, {
      status: user.authStatus || 'none',
      rejectReason: user.rejectReason
    });
  } catch (err) {
    error(res, err.message);
  }
};

const getHouses = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.agentId;
    const { page = 1, pageSize = 10, status } = req.query;

    const query = { owner: userId };
    if (status) query.status = status;

    const houses = await House.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

    const total = await House.countDocuments(query);

    success(res, {
      list: houses,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (err) {
    error(res, err.message);
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    const { page = 1, pageSize = 20, type } = req.query;

    const query = { toUser: userId };
    if (type) query.type = type;

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .populate('fromUser', 'nickname avatar phone');

    const total = await Message.countDocuments(query);

    success(res, {
      list: messages,
      total
    });
  } catch (err) {
    error(res, err.message);
  }
};

const getStatisticsOverview = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    const houses = await House.find({ owner: userId });
    const totalHouses = houses.length;
    const onlineHouses = houses.filter(h => h.status === 'approved').length;
    const totalViews = houses.reduce((sum, h) => sum + (h.views || 0), 0);
    const totalFavorites = houses.reduce((sum, h) => sum + (h.favorites || 0), 0);

    success(res, {
      todayViews: Math.floor(Math.random() * 100) + 20,
      todayAppointments: Math.floor(Math.random() * 5) + 1,
      todayCalls: Math.floor(Math.random() * 3) + 1,
      todayMessages: Math.floor(Math.random() * 5) + 2,
      totalHouses,
      onlineHouses,
      totalViews,
      totalFavorites,
      totalAppointments: Math.floor(Math.random() * 20) + 5,
      totalCalls: Math.floor(Math.random() * 50) + 10,
      pendingAppointments: Math.floor(Math.random() * 5),
      unreadMessages: Math.floor(Math.random() * 3)
    });
  } catch (err) {
    error(res, err.message);
  }
};

const getHouseStatistics = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    const houses = await House.find({ owner: userId }).sort({ views: -1 }).limit(5);

    success(res, {
      ranking: houses.map(h => ({
        _id: h._id,
        title: h.title,
        image: h.images?.[0] || '',
        views: h.views || 0,
        favorites: h.favorites || 0
      }))
    });
  } catch (err) {
    error(res, err.message);
  }
};

const getTrendStatistics = async (req, res) => {
  try {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const list = days.map((date, i) => ({
      date,
      value: Math.floor(Math.random() * 200) + 50,
      percent: Math.floor(Math.random() * 60) + 40
    }));

    success(res, { list });
  } catch (err) {
    error(res, err.message);
  }
};

const markMessageRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { read: true });
    success(res, null, '已标记已读');
  } catch (err) {
    error(res, err.message);
  }
};

const offlineHouse = async (req, res) => {
  try {
    const { id } = req.params;
    await House.findByIdAndUpdate(id, { status: 'offline' });
    success(res, null, '已下架');
  } catch (err) {
    error(res, err.message);
  }
};

const onlineHouse = async (req, res) => {
  try {
    const { id } = req.params;
    await House.findByIdAndUpdate(id, { status: 'approved' });
    success(res, null, '已上架');
  } catch (err) {
    error(res, err.message);
  }
};

const deleteHouse = async (req, res) => {
  try {
    const { id } = req.params;
    await House.findByIdAndDelete(id);
    success(res, null, '删除成功');
  } catch (err) {
    error(res, err.message);
  }
};

const createHouse = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const house = new House({
      ...req.body,
      owner: userId,
      status: req.body.status || 'pending'
    });
    await house.save();
    success(res, { _id: house._id }, '创建成功');
  } catch (err) {
    error(res, err.message);
  }
};

const updateHouse = async (req, res) => {
  try {
    const { id } = req.params;
    await House.findByIdAndUpdate(id, req.body);
    success(res, null, '更新成功');
  } catch (err) {
    error(res, err.message);
  }
};

const getHouseDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const house = await House.findById(id);
    if (!house) {
      return error(res, '房源不存在', 404);
    }
    success(res, house);
  } catch (err) {
    error(res, err.message);
  }
};

const getAppointments = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const mockAppointments = [
      { _id: '1', userName: '王先生', userPhone: '13800138001', houseTitle: '万科城三室两厅', date: '2024-01-20', time: '14:00', status: 'pending', createdAt: '2024-01-18 10:30' },
      { _id: '2', userName: '李女士', userPhone: '13800138002', houseTitle: '碧桂园精装两室', date: '2024-01-21', time: '10:00', status: 'confirmed', createdAt: '2024-01-17 15:20' }
    ];
    success(res, {
      list: mockAppointments,
      total: mockAppointments.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (err) {
    error(res, err.message);
  }
};

const confirmAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    success(res, null, '已确认预约');
  } catch (err) {
    error(res, err.message);
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    const user = await User.findById(userId);
    if (!user) {
      return error(res, '用户不存在', 404);
    }
    success(res, {
      _id: user._id,
      phone: user.phone,
      nickname: user.nickname,
      realName: user.realName,
      avatar: user.avatar,
      role: user.role,
      authStatus: user.authStatus,
      company: user.company,
      certificateNo: user.certificateNo
    });
  } catch (err) {
    error(res, err.message);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!user) {
      return error(res, '用户不存在', 404);
    }
    success(res, null, '更新成功');
  } catch (err) {
    error(res, err.message);
  }
};

router.post('/auth/send-code', sendSmsCode);
router.post('/auth/login', login);
router.post('/auth/submit', auth, submitAuth);
router.get('/auth/status', getAuthStatus);

router.get('/houses', getHouses);
router.post('/houses', auth, createHouse);
router.get('/houses/:id', getHouseDetail);
router.put('/houses/:id', auth, updateHouse);
router.delete('/houses/:id', auth, deleteHouse);
router.post('/houses/:id/offline', auth, offlineHouse);
router.post('/houses/:id/online', auth, onlineHouse);

router.get('/messages', getMessages);
router.post('/messages/:id/read', auth, markMessageRead);

router.get('/appointments', getAppointments);
router.post('/appointments/:id/confirm', auth, confirmAppointment);

router.get('/statistics/overview', getStatisticsOverview);
router.get('/statistics/houses', getHouseStatistics);
router.get('/statistics/trend', getTrendStatistics);

router.get('/user/profile', getUserProfile);
router.put('/user/profile', auth, updateUserProfile);

module.exports = router;
