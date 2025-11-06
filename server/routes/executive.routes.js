const express = require('express');
const router = express.Router();
const { 
  loginExecutive, 
  addFarmer, 
  getFarmers, 
  updateAlerts, 
  getDashboard, 
  sendSMS, 
  getCarbonCredits, 
  getPlantDetails, 
  uploadFieldPhotos, 
  getIncomeAnalysis, 
  getSchemes 
} = require('../controllers/executive.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../utils/fileUpload');

// Public routes
router.post('/login', loginExecutive);

// Protected routes (executive only)
router.post('/farmer', protect, authorize('executive'), addFarmer);
router.get('/farmers', protect, authorize('executive'), getFarmers);
router.put('/alerts', protect, authorize('executive'), updateAlerts);
router.get('/dashboard', protect, authorize('executive'), getDashboard);
router.post('/sms', protect, authorize('executive'), sendSMS);
router.get('/carbon-credits', protect, authorize('executive'), getCarbonCredits);
router.get('/plant-details', protect, authorize('executive'), getPlantDetails);
router.post('/field-photos', protect, authorize('executive'), upload.array('photos', 5), uploadFieldPhotos);
router.get('/income-analysis', protect, authorize('executive'), getIncomeAnalysis);
router.get('/schemes', protect, authorize('executive'), getSchemes);

module.exports = router;