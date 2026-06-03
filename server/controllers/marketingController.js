const Banner = require('../models/Banner');
const { success, error } = require('../utils/response');

const getBannerList = async (req, res) => {
  try {
    const { position = 'home', city } = req.query;
    
    const query = { status: 'active', position };
    if (city) query.city = city;

    const list = await Banner.find(query)
      .sort({ sort: -1, createdAt: -1 });

    success(res, list);
  } catch (err) {
    error(res, err.message);
  }
};

const getHomeData = async (req, res) => {
  try {
    const { city } = req.query;
    
    const bannerQuery = { status: 'active', position: 'home' };
    if (city) bannerQuery.city = city;
    
    const banners = await Banner.find(bannerQuery).sort({ sort: -1 });

    success(res, {
      banners,
      categories: [
        { id: 'new', name: '新房', icon: '🏠', color: '#ff6b6b' },
        { id: 'secondhand', name: '二手房', icon: '🏡', color: '#4ecdc4' },
        { id: 'rent_whole', name: '整租', icon: '🔑', color: '#45b7d1' },
        { id: 'rent_share', name: '合租', icon: '👥', color: '#96ceb4' },
        { id: 'shop', name: '商铺', icon: '🏪', color: '#ffeaa7' }
      ],
      sections: [
        { id: 'special', name: '特价捡漏', icon: '💰', more: true },
        { id: 'new', name: '新上房源', icon: '✨', more: true },
        { id: 'hot', name: '热门小区', icon: '🔥', more: true }
      ]
    });
  } catch (err) {
    error(res, err.message);
  }
};

module.exports = {
  getBannerList,
  getHomeData
};
