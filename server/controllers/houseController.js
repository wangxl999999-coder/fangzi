const House = require('../models/House');
const User = require('../models/User');
const { success, error, pagination } = require('../utils/response');

const getHouseList = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      type,
      city,
      keyword,
      priceMin,
      priceMax,
      areaMin,
      areaMax,
      bedrooms,
      floor,
      decoration,
      facilities,
      propertyType,
      sort = 'latest',
      lat,
      lng
    } = req.query;

    const query = { status: 'approved' };
    
    if (type) query.type = type;
    if (city) query.city = city;
    
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { address: { $regex: keyword, $options: 'i' } },
        { communityName: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }
    
    if (areaMin || areaMax) {
      query.area = {};
      if (areaMin) query.area.$gte = Number(areaMin);
      if (areaMax) query.area.$lte = Number(areaMax);
    }
    
    if (bedrooms) {
      if (bedrooms === '5+') {
        query.bedrooms = { $gte: 5 };
      } else {
        query.bedrooms = Number(bedrooms);
      }
    }
    
    if (floor) {
      const floorMap = {
        'low': '低楼层',
        'middle': '中楼层',
        'high': '高楼层',
        'ground': '底层',
        'top': '顶层'
      };
      const floorValues = floor.split(',').map(f => floorMap[f]).filter(Boolean);
      if (floorValues.length > 0) {
        query.floor = { $in: floorValues };
      }
    }
    
    if (decoration) {
      query.decoration = { $in: decoration.split(',') };
    }
    
    if (facilities) {
      query.facilities = { $all: facilities.split(',') };
    }
    
    if (propertyType) {
      query.propertyType = propertyType;
    }
    
    if (req.query.orientation) {
      query.orientation = { $in: req.query.orientation.split(',') };
    }

    let sortObj = {};
    switch (sort) {
      case 'price_asc':
        sortObj = { price: 1 };
        break;
      case 'price_desc':
        sortObj = { price: -1 };
        break;
      case 'area':
        sortObj = { area: -1 };
        break;
      case 'distance':
        if (lat && lng) {
          sortObj = { 'location.lat': 1, 'location.lng': 1 };
        } else {
          sortObj = { createdAt: -1 };
        }
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const total = await House.countDocuments(query);
    const list = await House.find(query)
      .sort(sortObj)
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize))
      .select('title type price priceUnit area bedrooms livingrooms bathrooms floor decoration address city district communityName images tags isSpecial isNew isHot viewCount favoriteCount createdAt owner contactName');

    pagination(res, list, total, Number(page), Number(pageSize));
  } catch (err) {
    error(res, err.message);
  }
};

const getHouseDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    const house = await House.findById(id)
      .populate('owner', 'nickname avatar phone realName role company authStatus')
      .populate('community');

    if (!house) {
      return error(res, '房源不存在');
    }

    house.viewCount += 1;
    await house.save();

    if (req.user && req.user.id) {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          viewHistory: {
            $each: [{ house: house._id, viewedAt: new Date() }],
            $position: 0
          }
        }
      });
    }

    success(res, house);
  } catch (err) {
    error(res, err.message);
  }
};

const getSpecialHouses = async (req, res) => {
  try {
    const { city, limit = 10 } = req.query;
    const query = { status: 'approved', isSpecial: true };
    if (city) query.city = city;
    
    const list = await House.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select('title type price priceUnit area bedrooms livingrooms floor decoration address communityName images tags createdAt');
    
    success(res, list);
  } catch (err) {
    error(res, err.message);
  }
};

const getNewHouses = async (req, res) => {
  try {
    const { city, limit = 10 } = req.query;
    const query = { status: 'approved', isNew: true };
    if (city) query.city = city;
    
    const list = await House.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select('title type price priceUnit area bedrooms livingrooms floor decoration address communityName images tags createdAt');
    
    success(res, list);
  } catch (err) {
    error(res, err.message);
  }
};

const createHouse = async (req, res) => {
  try {
    const houseData = {
      ...req.body,
      owner: req.user.id,
      ownerType: req.user.role === 'agent' ? 'agent' : 'landlord'
    };

    const house = new House(houseData);
    await house.save();

    success(res, house, '房源发布成功');
  } catch (err) {
    error(res, err.message);
  }
};

const updateHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const house = await House.findById(id);

    if (!house) {
      return error(res, '房源不存在');
    }

    if (house.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return error(res, '无权限修改');
    }

    const updatedHouse = await House.findByIdAndUpdate(id, req.body, { new: true });
    success(res, updatedHouse, '房源更新成功');
  } catch (err) {
    error(res, err.message);
  }
};

const deleteHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const house = await House.findById(id);

    if (!house) {
      return error(res, '房源不存在');
    }

    if (house.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return error(res, '无权限删除');
    }

    await House.findByIdAndDelete(id);
    success(res, null, '房源删除成功');
  } catch (err) {
    error(res, err.message);
  }
};

const getMyHouses = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, status } = req.query;
    const query = { owner: req.user.id };
    if (status) query.status = status;

    const total = await House.countDocuments(query);
    const list = await House.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    pagination(res, list, total, Number(page), Number(pageSize));
  } catch (err) {
    error(res, err.message);
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const { houseId } = req.body;
    const user = await User.findById(req.user.id);
    
    const index = user.favorites.indexOf(houseId);
    let isFavorite;
    
    if (index > -1) {
      user.favorites.splice(index, 1);
      isFavorite = false;
      await House.findByIdAndUpdate(houseId, { $inc: { favoriteCount: -1 } });
    } else {
      user.favorites.push(houseId);
      isFavorite = true;
      await House.findByIdAndUpdate(houseId, { $inc: { favoriteCount: 1 } });
    }
    
    await user.save();
    success(res, { isFavorite }, isFavorite ? '收藏成功' : '取消收藏');
  } catch (err) {
    error(res, err.message);
  }
};

const getFavorites = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const user = await User.findById(req.user.id).populate({
      path: 'favorites',
      match: { status: 'approved' },
      options: {
        sort: { createdAt: -1 },
        skip: (page - 1) * pageSize,
        limit: Number(pageSize)
      }
    });

    const total = user.favorites.length;
    pagination(res, user.favorites, total, Number(page), Number(pageSize));
  } catch (err) {
    error(res, err.message);
  }
};

const getViewHistory = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const user = await User.findById(req.user.id);
    
    const start = (page - 1) * pageSize;
    const end = start + Number(pageSize);
    const historyItems = user.viewHistory.slice(start, end);
    
    const houseIds = historyItems.map(item => item.house);
    const houses = await House.find({ _id: { $in: houseIds }, status: 'approved' });
    
    const houseMap = new Map(houses.map(h => [h._id.toString(), h]));
    const list = historyItems
      .map(item => ({
        ...houseMap.get(item.house.toString())?._doc,
        viewedAt: item.viewedAt
      }))
      .filter(item => item.title);

    pagination(res, list, user.viewHistory.length, Number(page), Number(pageSize));
  } catch (err) {
    error(res, err.message);
  }
};

const getStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    const [totalHouses, approvedHouses, pendingHouses, totalViews, totalFavorites] = await Promise.all([
      House.countDocuments({ owner: userId }),
      House.countDocuments({ owner: userId, status: 'approved' }),
      House.countDocuments({ owner: userId, status: 'pending' }),
      House.aggregate([
        { $match: { owner: userId } },
        { $group: { _id: null, total: { $sum: '$viewCount' } } }
      ]),
      House.aggregate([
        { $match: { owner: userId } },
        { $group: { _id: null, total: { $sum: '$favoriteCount' } } }
      ])
    ]);

    const recentHouses = await House.find({ owner: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title viewCount favoriteCount status createdAt');

    success(res, {
      totalHouses,
      approvedHouses,
      pendingHouses,
      totalViews: totalViews[0]?.total || 0,
      totalFavorites: totalFavorites[0]?.total || 0,
      recentHouses
    });
  } catch (err) {
    error(res, err.message);
  }
};

module.exports = {
  getHouseList,
  getHouseDetail,
  getSpecialHouses,
  getNewHouses,
  createHouse,
  updateHouse,
  deleteHouse,
  getMyHouses,
  toggleFavorite,
  getFavorites,
  getViewHistory,
  getStatistics
};
