const express = require('express');
const router = express.Router();
const { getProjectList, getProjectDetail, getHotProjects } = require('../controllers/projectController');

router.get('/', getProjectList);
router.get('/hot', getHotProjects);
router.get('/:id', getProjectDetail);

module.exports = router;
