const Project = require('../models/Project');
const { success, error, pagination } = require('../utils/response');

const getProjectList = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      city,
      district,
      priceMin,
      priceMax,
      areaMin,
      areaMax,
      bedrooms,
      saleStatus,
      decoration,
      keyword,
      isHot
    } = req.query;

    const query = { status: 'approved' };
    
    if (city) query.city = city;
    if (district) query.district = district;
    if (saleStatus) query.saleStatus = saleStatus;
    if (decoration) query.decoration = decoration;
    if (isHot) query.isHot = true;
    
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { address: { $regex: keyword, $options: 'i' } },
        { developer: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }
    
    if (areaMin || areaMax) {
      query['areaRange.min'] = areaMin ? { $gte: Number(areaMin) } : undefined;
      query['areaRange.max'] = areaMax ? { $lte: Number(areaMax) } : undefined;
    }
    
    if (bedrooms) {
      query['houseType.bedrooms'] = Number(bedrooms);
    }

    const total = await Project.countDocuments(query);
    const list = await Project.find(query)
      .sort({ isHot: -1, createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize))
      .select('name city district address price priceUnit totalPriceStart areaRange houseType developer saleStatus decoration openDate deliverDate images isHot isNew viewCount createdAt');

    pagination(res, list, total, Number(page), Number(pageSize));
  } catch (err) {
    error(res, err.message);
  }
};

const getProjectDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    
    if (!project) {
      return error(res, '楼盘不存在');
    }

    project.viewCount += 1;
    await project.save();

    success(res, project);
  } catch (err) {
    error(res, err.message);
  }
};

const getHotProjects = async (req, res) => {
  try {
    const { city, limit = 10 } = req.query;
    const query = { status: 'approved', isHot: true };
    if (city) query.city = city;
    
    const list = await Project.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select('name city district address price priceUnit areaRange houseType developer saleStatus images isHot viewCount createdAt');
    
    success(res, list);
  } catch (err) {
    error(res, err.message);
  }
};

module.exports = {
  getProjectList,
  getProjectDetail,
  getHotProjects
};
