const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ code: 401, message: '请先登录' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ code: 401, message: '登录已过期，请重新登录' });
  }
};

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ code: 403, message: '无权限访问' });
    }
    next();
  });
};

const agentAuth = (req, res, next) => {
  auth(req, res, () => {
    if (!['agent', 'landlord', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ code: 403, message: '无权限访问' });
    }
    next();
  });
};

module.exports = { auth, adminAuth, agentAuth };
