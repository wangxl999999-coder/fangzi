const Community = require('../models/Community');
const { success, error, pagination } = require('../utils/response');

const getCommunityList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, city, keyword, isHot } = req.query;
    
    const query = {};
    if (city) query.city = city;
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }
    if (isHot) query.isHot = true;

    const total = await Community.countDocuments(query);
    const list = await Community.find(query)
      .sort({ sort: -1, createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    pagination(res, list, total, Number(page), Number(pageSize));
  } catch (err) {
    error(res, err.message);
  }
};

const getCommunityDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const community = await Community.findById(id);
    
    if (!community) {
      return error(res, '小区不存在');
    }

    success(res, community);
  } catch (err) {
    error(res, err.message);
  }
};

const getHotCommunities = async (req, res) => {
  try {
    const { city, limit = 10 } = req.query;
    const query = { isHot: true };
    if (city) query.city = city;
    
    const list = await Community.find(query)
      .sort({ sort: -1, houseCount: -1 })
      .limit(Number(limit));
    
    success(res, list);
  } catch (err) {
    error(res, err.message);
  }
};

module.exports = {
  getCommunityList,
  getCommunityDetail,
  getHotCommunities
};
