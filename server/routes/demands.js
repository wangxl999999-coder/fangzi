const express = require('express');
const router = express.Router();
const {
  getDemandList,
  getDemandDetail,
  createDemand,
  updateDemand,
  deleteDemand,
  getMyDemands
} = require('../controllers/demandController');
const { auth } = require('../middleware/auth');

router.get('/', getDemandList);
router.get('/:id', getDemandDetail);
router.post('/', auth, createDemand);
router.put('/:id', auth, updateDemand);
router.delete('/:id', auth, deleteDemand);
router.get('/my/list', auth, getMyDemands);

module.exports = router;
