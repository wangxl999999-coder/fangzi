const express = require('express');
const router = express.Router();
const { getCommunityList, getCommunityDetail, getHotCommunities } = require('../controllers/communityController');

router.get('/', getCommunityList);
router.get('/hot', getHotCommunities);
router.get('/:id', getCommunityDetail);

module.exports = router;
