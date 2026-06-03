const express = require('express');
const router = express.Router();
const { getBannerList, getHomeData } = require('../controllers/marketingController');

router.get('/banners', getBannerList);
router.get('/home', getHomeData);

module.exports = router;
