const User = require('../models/User');
const { success, error } = require('../utils/response');

const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    success(res, user);
  } catch (err) {
    error(res, err.message);
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { nickname, avatar, city } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { nickname, avatar, city },
      { new: true }
    ).select('-password');
    
    success(res, user, '更新成功');
  } catch (err) {
    error(res, err.message);
  }
};

const submitAuth = async (req, res) => {
  try {
    const {
      realName,
      idCard,
      idCardFront,
      idCardBack,
      agentLicense,
      company,
      role
    } = req.body;

    const user = await User.findById(req.user.id);
    
    if (!realName || !idCard || !idCardFront || !idCardBack) {
      return error(res, '请填写完整的认证信息');
    }

    user.realName = realName;
    user.idCard = idCard;
    user.idCardFront = idCardFront;
    user.idCardBack = idCardBack;
    user.authStatus = 'pending';
    
    if (role === 'agent') {
      if (!agentLicense) {
        return error(res, '请上传经纪人资质证书');
      }
      user.agentLicense = agentLicense;
      user.company = company;
      user.role = 'agent';
    } else if (role === 'landlord') {
      user.role = 'landlord';
    }

    await user.save();
    
    success(res, { authStatus: 'pending' }, '认证资料已提交，请等待审核');
  } catch (err) {
    error(res, err.message);
  }
};

const getAuthStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('authStatus authRejectReason realName idCard idCardFront idCardBack agentLicense company role');
    success(res, user);
  } catch (err) {
    error(res, err.message);
  }
};

const switchRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'landlord', 'agent'].includes(role)) {
      return error(res, '无效的角色类型');
    }

    const user = await User.findById(req.user.id);
    
    if (role !== 'user' && user.authStatus !== 'approved') {
      return error(res, '请先完成实名认证');
    }

    if (role === 'agent' && !user.agentLicense) {
      return error(res, '请先上传经纪人资质');
    }

    user.role = role;
    await user.save();

    const token = require('jsonwebtoken').sign(
      { id: user._id, role: user.role, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    success(res, {
      token,
      user: {
        id: user._id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
        authStatus: user.authStatus
      }
    }, '角色切换成功');
  } catch (err) {
    error(res, err.message);
  }
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  submitAuth,
  getAuthStatus,
  switchRole
};
