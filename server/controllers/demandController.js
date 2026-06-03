const Demand = require('../models/Demand');
const { success, error, pagination } = require('../utils/response');

const getDemandList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, type, city, keyword } = req.query;
    
    const query = { status: 'approved' };
    if (type) query.type = type;
    if (city) query.city = city;
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    const total = await Demand.countDocuments(query);
    const list = await Demand.find(query)
      .populate('userId', 'nickname avatar phone')
      .sort({ urgency: -1, createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    pagination(res, list, total, Number(page), Number(pageSize));
  } catch (err) {
    error(res, err.message);
  }
};

const getDemandDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const demand = await Demand.findById(id).populate('userId', 'nickname avatar phone');
    
    if (!demand) {
      return error(res, '需求不存在');
    }

    demand.viewCount += 1;
    await demand.save();

    success(res, demand);
  } catch (err) {
    error(res, err.message);
  }
};

const createDemand = async (req, res) => {
  try {
    const demandData = {
      ...req.body,
      userId: req.user.id,
      expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    const demand = new Demand(demandData);
    await demand.save();

    success(res, demand, '需求发布成功');
  } catch (err) {
    error(res, err.message);
  }
};

const updateDemand = async (req, res) => {
  try {
    const { id } = req.params;
    const demand = await Demand.findById(id);

    if (!demand) {
      return error(res, '需求不存在');
    }

    if (demand.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return error(res, '无权限修改');
    }

    const updatedDemand = await Demand.findByIdAndUpdate(id, req.body, { new: true });
    success(res, updatedDemand, '需求更新成功');
  } catch (err) {
    error(res, err.message);
  }
};

const deleteDemand = async (req, res) => {
  try {
    const { id } = req.params;
    const demand = await Demand.findById(id);

    if (!demand) {
      return error(res, '需求不存在');
    }

    if (demand.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return error(res, '无权限删除');
    }

    await Demand.findByIdAndDelete(id);
    success(res, null, '需求删除成功');
  } catch (err) {
    error(res, err.message);
  }
};

const getMyDemands = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, status } = req.query;
    const query = { userId: req.user.id };
    if (status) query.status = status;

    const total = await Demand.countDocuments(query);
    const list = await Demand.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    pagination(res, list, total, Number(page), Number(pageSize));
  } catch (err) {
    error(res, err.message);
  }
};

module.exports = {
  getDemandList,
  getDemandDetail,
  createDemand,
  updateDemand,
  deleteDemand,
  getMyDemands
};
