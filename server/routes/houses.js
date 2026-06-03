const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/houseController');
const { auth, agentAuth } = require('../middleware/auth');

router.get('/', getHouseList);
router.get('/special', getSpecialHouses);
router.get('/new', getNewHouses);
router.get('/:id', auth, getHouseDetail);
router.post('/', agentAuth, createHouse);
router.put('/:id', agentAuth, updateHouse);
router.delete('/:id', agentAuth, deleteHouse);
router.get('/my/list', agentAuth, getMyHouses);
router.post('/favorite/toggle', auth, toggleFavorite);
router.get('/favorite/list', auth, getFavorites);
router.get('/history/list', auth, getViewHistory);
router.get('/statistics/data', agentAuth, getStatistics);

module.exports = router;
