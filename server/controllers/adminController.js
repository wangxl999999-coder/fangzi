const User = require('../models/User');
const House = require('../models/House');
const Project = require('../models/Project');
const Community = require('../models/Community');
const Demand = require('../models/Demand');
const Banner = require('../models/Banner');
const Message = require('../models/Message');
const { success, error, pagination } = require('../utils/response');

const getDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalHouses,
      totalProjects,
      totalDemands,
      pendingHouses,
      pendingUsers,
      pendingProjects,
      pendingDemands
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      House.countDocuments(),
      Project.countDocuments(),
      Demand.countDocuments(),
      House.countDocuments({ status: 'pending' }),
      User.countDocuments({ authStatus: 'pending', role: { $in: ['landlord', 'agent'] } }),
      Project.countDocuments({ status: 'pending' }),
      Demand.countDocuments({ status: 'pending' })
    ]);

    const recentHouses = await House.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title type status createdAt');

    const recentUsers = await User.find({ role: { $ne: 'admin' } })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('phone nickname role authStatus createdAt');

    success(res, {
      statistics: {
        totalUsers,
        totalHouses,
        totalProjects,
        totalDemands,
        pendingHouses,
        pendingUsers,
        pendingProjects,
        pendingDemands
      },
      recentHouses,
      recentUsers
    });
  } catch (err) {
    error(res, err.message);
  }
};

const getUserList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword, role, authStatus, status } = req.query;
    
    const query = { role: { $ne: 'admin' } };
    if (keyword) {
      query.$or = [
        { phone: { $regex: keyword } },
        { nickname: { $regex: keyword, $options: 'i' } },
        { realName: { $regex: keyword, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    if (authStatus) query.authStatus = authStatus;
    if (status) query.status = status;

    const total = await User.countDocuments(query);
    const list = await User.find(query)
      .select('-password -favorites -viewHistory')
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    pagination(res, list, total, Number(page), Number(pageSize));
  } catch (err) {
    error(res, err.message);
  }
};

const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return error(res, '用户不存在');
    }

    success(res, user);
  } catch (err) {
    error(res, err.message);
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    
    await User.findByIdAndUpdate(id, { status });
    success(res, null, '用户状态更新成功');
  } catch (err) {
    error(res, err.message);
  }
};

const auditUser = async (req, res) => {
  try {
    const { id, authStatus, authRejectReason } = req.body;
    
    const user = await User.findByIdAndUpdate(
      id,
      { authStatus, authRejectReason: authRejectReason || '' },
      { new: true }
    );

    await Message.create({
      receiverId: id,
      type: 'system',
      title: '实名认证结果',
      content: authStatus === 'approved' 
        ? '恭喜您，实名认证已通过！' 
        : `实名认证未通过，原因：${authRejectReason || '资料不完整'}`
    });

    success(res, null, '审核完成');
  } catch (err) {
    error(res, err.message);
  }
};

const getHouseList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword, type, city, status } = req.query;
    
    const query = {};
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { address: { $regex: keyword, $options: 'i' } },
        { communityName: { $regex: keyword, $options: 'i' } }
      ];
    }
    if (type) query.type = type;
    if (city) query.city = city;
    if (status) query.status = status;

    const total = await House.countDocuments(query);
    const list = await House.find(query)
      .populate('owner', 'phone nickname')
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    pagination(res, list, total, Number(page), Number(pageSize));
  } catch (err) {
    error(res, err.message);
  }
};

const auditHouse = async (req, res) => {
  try {
    const { id, status, rejectReason } = req.body;
    
    const house = await House.findByIdAndUpdate(
      id,
      { status, rejectReason: rejectReason || '' },
      { new: true }
    ).populate('owner');

    await Message.create({
      receiverId: house.owner._id,
      type: 'house',
      title: '房源审核结果',
      content: status === 'approved' 
        ? `您的房源"${house.title}"已通过审核！` 
        : `您的房源"${house.title}"未通过审核，原因：${rejectReason || '不符合规范'}`,
      houseId: id
    });

    success(res, null, '审核完成');
  } catch (err) {
    error(res, err.message);
  }
};

const updateHouseStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    
    await House.findByIdAndUpdate(id, { status });
    success(res, null, '房源状态更新成功');
  } catch (err) {
    error(res, err.message);
  }
};

const deleteHouse = async (req, res) => {
  try {
    const { id } = req.params;
    await House.findByIdAndDelete(id);
    success(res, null, '房源删除成功');
  } catch (err) {
    error(res, err.message);
  }
};

const getProjectList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword, city, saleStatus, status } = req.query;
    
    const query = {};
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }
    if (city) query.city = city;
    if (saleStatus) query.saleStatus = saleStatus;
    if (status) query.status = status;

    const total = await Project.countDocuments(query);
    const list = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    pagination(res, list, total, Number(page), Number(pageSize));
  } catch (err) {
    error(res, err.message);
  }
};

const createProject = async (req, res) => {
  try {
    const project = new Project({ ...req.body, status: 'approved' });
    await project.save();
    success(res, project, '楼盘创建成功');
  } catch (err) {
    error(res, err.message);
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
    success(res, project, '楼盘更新成功');
  } catch (err) {
    error(res, err.message);
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    success(res, null, '楼盘删除成功');
  } catch (err) {
    error(res, err.message);
  }
};

const auditProject = async (req, res) => {
  try {
    const { id, status } = req.body;
    await Project.findByIdAndUpdate(id, { status });
    success(res, null, '审核完成');
  } catch (err) {
    error(res, err.message);
  }
};

const getDemandList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword, type, city, status } = req.query;
    
    const query = {};
    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }
    if (type) query.type = type;
    if (city) query.city = city;
    if (status) query.status = status;

    const total = await Demand.countDocuments(query);
    const list = await Demand.find(query)
      .populate('userId', 'phone nickname')
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    pagination(res, list, total, Number(page), Number(pageSize));
  } catch (err) {
    error(res, err.message);
  }
};

const auditDemand = async (req, res) => {
  try {
    const { id, status } = req.body;
    
    const demand = await Demand.findByIdAndUpdate(id, { status }, { new: true }).populate('userId');
    
    await Message.create({
      receiverId: demand.userId._id,
      type: 'demand',
      title: '需求审核结果',
      content: status === 'approved' 
        ? `您的需求"${demand.title}"已通过审核！` 
        : `您的需求"${demand.title}"未通过审核`,
      demandId: id
    });

    success(res, null, '审核完成');
  } catch (err) {
    error(res, err.message);
  }
};

const getBannerList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, position, status } = req.query;
    
    const query = {};
    if (position) query.position = position;
    if (status) query.status = status;

    const total = await Banner.countDocuments(query);
    const list = await Banner.find(query)
      .sort({ sort: -1, createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    pagination(res, list, total, Number(page), Number(pageSize));
  } catch (err) {
    error(res, err.message);
  }
};

const createBanner = async (req, res) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    success(res, banner, '轮播图创建成功');
  } catch (err) {
    error(res, err.message);
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndUpdate(id, req.body, { new: true });
    success(res, banner, '轮播图更新成功');
  } catch (err) {
    error(res, err.message);
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    await Banner.findByIdAndDelete(id);
    success(res, null, '轮播图删除成功');
  } catch (err) {
    error(res, err.message);
  }
};

const getCommunityList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword, city } = req.query;
    
    const query = {};
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }
    if (city) query.city = city;

    const total = await Community.countDocuments(query);
    const list = await Community.find(query)
      .sort({ isHot: -1, createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    pagination(res, list, total, Number(page), Number(pageSize));
  } catch (err) {
    error(res, err.message);
  }
};

const createCommunity = async (req, res) => {
  try {
    const community = new Community(req.body);
    await community.save();
    success(res, community, '小区创建成功');
  } catch (err) {
    error(res, err.message);
  }
};

const updateCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const community = await Community.findByIdAndUpdate(id, req.body, { new: true });
    success(res, community, '小区更新成功');
  } catch (err) {
    error(res, err.message);
  }
};

const deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    await Community.findByIdAndDelete(id);
    success(res, null, '小区删除成功');
  } catch (err) {
    error(res, err.message);
  }
};

module.exports = {
  getDashboard,
  getUserList,
  getUserDetail,
  updateUserStatus,
  auditUser,
  getHouseList,
  auditHouse,
  updateHouseStatus,
  deleteHouse,
  getProjectList,
  createProject,
  updateProject,
  deleteProject,
  auditProject,
  getDemandList,
  auditDemand,
  getBannerList,
  createBanner,
  updateBanner,
  deleteBanner,
  getCommunityList,
  createCommunity,
  updateCommunity,
  deleteCommunity
};
