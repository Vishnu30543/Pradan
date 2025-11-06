const express = require('express');
const router = express.Router();
const { 
  loginAdmin, 
  addExecutive, 
  getExecutives, 
  removeExecutive, 
  getFarmers, 
  removeFarmer, 
  getAnalytics, 
  generateReport 
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/login', loginAdmin);

// Protected routes (admin only)
router.post('/executive', protect, authorize('admin'), addExecutive);
router.get('/executives', protect, authorize('admin'), getExecutives);
router.delete('/executive/:id', protect, authorize('admin'), removeExecutive);
router.get('/farmers', protect, authorize('admin'), getFarmers);
router.delete('/farmer/:id', protect, authorize('admin'), removeFarmer);
router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.post('/report', protect, authorize('admin'), generateReport);

module.exports = router;