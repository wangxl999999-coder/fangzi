const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { success, error } = require('../utils/response');

const smsCodes = new Map();

const sendSmsCode = async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return error(res, '请输入正确的手机号');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    smsCodes.set(phone, { code, expires: Date.now() + 5 * 60 * 1000 });
    
    console.log(`验证码: ${code} (手机号: ${phone})`);
    
    success(res, { sent: true }, '验证码发送成功');
  } catch (err) {
    error(res, err.message);
  }
};

const login = async (req, res) => {
  try {
    const { phone, code, password, role } = req.body;
    
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return error(res, '请输入正确的手机号');
    }

    let user = await User.findOne({ phone });

    if (role === 'admin') {
      if (!password) {
        return error(res, '请输入密码');
      }
      if (!user || user.role !== 'admin') {
        return error(res, '账号或密码错误');
      }
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        return error(res, '账号或密码错误');
      }
    } else {
      if (!code) {
        return error(res, '请输入验证码');
      }
      
      const smsData = smsCodes.get(phone);
      if (!smsData || smsData.code !== code || Date.now() > smsData.expires) {
        return error(res, '验证码错误或已过期');
      }
      
      smsCodes.delete(phone);

      if (!user) {
        user = new User({
          phone,
          role: role || 'user',
          nickname: '用户' + phone.slice(-4)
        });
        await user.save();
      } else if (role && user.role === 'user' && ['landlord', 'agent'].includes(role)) {
        user.role = role;
        await user.save();
      }
    }

    const token = jwt.sign(
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
        authStatus: user.authStatus,
        realName: user.realName
      }
    }, '登录成功');
  } catch (err) {
    error(res, err.message);
  }
};

const logout = async (req, res) => {
  success(res, null, '退出成功');
};

const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    success(res, user);
  } catch (err) {
    error(res, err.message, 401);
  }
};

module.exports = {
  sendSmsCode,
  login,
  logout,
  checkAuth
};
