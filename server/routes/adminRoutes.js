const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { loginAdmin } = require('../controllers/admin.controller');
router.post('/login', loginAdmin);

// Protect all routes
router.use(protect);
router.use(authorize('admin'));


// Import controllers
const executiveController = require('../controllers/executiveController');
const farmerController = require('../controllers/farmerController');
const analyticsController = require('../controllers/analyticsController');
const requestController = require('../controllers/requestController');

// Executive management routes
router.get('/executives', executiveController.getExecutives);
router.post('/executives', executiveController.createExecutive);
router.get('/executives/:id', executiveController.getExecutiveById);
router.put('/executives/:id', executiveController.updateExecutive);
router.delete('/executives/:id', executiveController.deleteExecutive);

// Farmer management routes
router.get('/farmers', farmerController.getFarmers);
router.get('/farmers/:id', farmerController.getFarmerById);
router.put('/farmers/:id', farmerController.updateFarmer);
router.delete('/farmers/:id', farmerController.deleteFarmer);
router.get('/farmer-report', farmerController.generateFarmerReport);

// Analytics routes
router.get('/analytics/dashboard', analyticsController.getDashboardStats);
router.get('/analytics/revenue', analyticsController.getRevenueAnalytics);
router.get('/analytics/farmers', analyticsController.getFarmerAnalytics);
router.get('/analytics/executives', analyticsController.getExecutiveAnalytics);
router.get('/analytics/requests', analyticsController.getRequestAnalytics);
router.get('/analytics/carbon-credits', analyticsController.getCarbonCreditAnalytics);

// Request management routes
router.get('/requests', requestController.getAllRequests);
router.get('/requests/:id', requestController.getRequestById);
router.put('/requests/:id/assign', requestController.assignRequest);

// Government scheme management routes
// Note: These routes redirect to the scheme management controller
router.get('/schemes', (req, res) => {
  res.redirect(307, '/api/scheme-management/schemes');
});

router.post('/schemes', (req, res) => {
  res.redirect(307, '/api/scheme-management/schemes');
});

router.get('/schemes/:id', (req, res) => {
  res.redirect(307, `/api/scheme-management/schemes/${req.params.id}`);
});

router.put('/schemes/:id', (req, res) => {
  res.redirect(307, `/api/scheme-management/schemes/${req.params.id}`);
});

router.delete('/schemes/:id', (req, res) => {
  res.redirect(307, `/api/scheme-management/schemes/${req.params.id}`);
});

// Scheme application management routes
router.get('/scheme-applications', (req, res) => {
  res.redirect(307, '/api/scheme-management/scheme-applications');
});

router.get('/scheme-applications/:id', (req, res) => {
  res.redirect(307, `/api/scheme-management/scheme-applications/${req.params.id}`);
});

router.put('/scheme-applications/:id/status', (req, res) => {
  res.redirect(307, `/api/scheme-management/scheme-applications/${req.params.id}/status`);
});

router.put('/scheme-applications/:id/assign', (req, res) => {
  res.redirect(307, `/api/scheme-management/scheme-applications/${req.params.id}/assign`);
});

router.get('/scheme-applications/stats', (req, res) => {
  res.redirect(307, '/api/scheme-management/scheme-applications/stats');
});

// System settings routes
router.get('/settings', require('../controllers/settingsController').getSettings);
router.put('/settings', require('../controllers/settingsController').updateSettings);

module.exports = router;