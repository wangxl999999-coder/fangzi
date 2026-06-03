const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getUserList,
  getUserDetail,
  updateUserStatus,
  auditUser,
  getHouseList,
  auditHouse,
  updateHouseStatus,
  deleteHouse,
  getProjectList,
  createProject,
  updateProject,
  deleteProject,
  auditProject,
  getDemandList,
  auditDemand,
  getBannerList,
  createBanner,
  updateBanner,
  deleteBanner,
  getCommunityList,
  createCommunity,
  updateCommunity,
  deleteCommunity
} = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

router.get('/dashboard', adminAuth, getDashboard);

router.get('/users', adminAuth, getUserList);
router.get('/users/:id', adminAuth, getUserDetail);
router.put('/users/status', adminAuth, updateUserStatus);
router.put('/users/audit', adminAuth, auditUser);

router.get('/houses', adminAuth, getHouseList);
router.put('/houses/audit', adminAuth, auditHouse);
router.put('/houses/status', adminAuth, updateHouseStatus);
router.delete('/houses/:id', adminAuth, deleteHouse);

router.get('/projects', adminAuth, getProjectList);
router.post('/projects', adminAuth, createProject);
router.put('/projects/:id', adminAuth, updateProject);
router.delete('/projects/:id', adminAuth, deleteProject);
router.put('/projects/audit', adminAuth, auditProject);

router.get('/demands', adminAuth, getDemandList);
router.put('/demands/audit', adminAuth, auditDemand);

router.get('/banners', adminAuth, getBannerList);
router.post('/banners', adminAuth, createBanner);
router.put('/banners/:id', adminAuth, updateBanner);
router.delete('/banners/:id', adminAuth, deleteBanner);

router.get('/communities', adminAuth, getCommunityList);
router.post('/communities', adminAuth, createCommunity);
router.put('/communities/:id', adminAuth, updateCommunity);
router.delete('/communities/:id', adminAuth, deleteCommunity);

module.exports = router;
