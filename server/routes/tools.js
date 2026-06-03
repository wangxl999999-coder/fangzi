const express = require('express');
const router = express.Router();
const { calculateMortgage, estimatePrice, getPolicyList, getCityList } = require('../controllers/toolsController');

router.post('/mortgage', calculateMortgage);
router.post('/estimate', estimatePrice);
router.get('/policies', getPolicyList);
router.get('/cities', getCityList);

module.exports = router;
