const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const requestController = require('../controllers/requestController');
const {
  loginExecutive,
  getDashboard,
  addFarmer,
  getFarmers,
  sendSMS,
  getCarbonCredits,
  getPlantDetails,
  getIncomeAnalysis,
  getSchemes,
  uploadFieldPhotos,
  getFields,
  createField
} = require('../controllers/executive.controller');
const upload = require('../middleware/upload');

// Public route - login (BEFORE protect middleware)
router.post('/login', loginExecutive);

// Dashboard route (needs protection)
router.get('/dashboard', protect, authorize('executive'), getDashboard);

// Protect all remaining routes
router.use(protect);
router.use(authorize('executive'));

// Farmer management routes
router.get('/farmers', getFarmers);
router.post('/farmers', addFarmer);
router.get('/farmers/:id', requestController.getFarmerById);

// Request management routes
router.get('/requests', requestController.getExecutiveRequests);
router.get('/requests/:id', requestController.getRequestById);
router.post('/requests/:id/comment', requestController.addComment);
router.put('/requests/:id/status', requestController.updateRequestStatus);

// Scheme application routes
router.get('/scheme-applications', (req, res) => {
  res.redirect(307, '/api/scheme-management/scheme-applications');
});

router.get('/scheme-applications/:id', (req, res) => {
  res.redirect(307, `/api/scheme-management/scheme-applications/${req.params.id}`);
});

router.put('/scheme-applications/:id/status', (req, res) => {
  res.redirect(307, `/api/scheme-management/scheme-applications/${req.params.id}/status`);
});

router.put('/scheme-applications/:id/verify-documents', (req, res) => {
  res.redirect(307, `/api/scheme-management/scheme-applications/${req.params.id}/verify-documents`);
});

// Analytics routes
router.get('/analytics/requests', requestController.getRequestAnalytics);
router.get('/analytics/farmers', requestController.getFarmerAnalytics);

// Communication routes
router.post('/sms', sendSMS);
router.post('/send-notification', requestController.sendNotification);

// Carbon credits and income analysis
router.get('/carbon-credits', getCarbonCredits);
router.get('/plant-details', getPlantDetails);
router.get('/income-analysis', getIncomeAnalysis);

// Government schemes
router.get('/schemes', getSchemes);

// Field visit routes
router.get('/field-visits', requestController.getFieldVisits);
router.post('/field-visits', requestController.scheduleFieldVisit);
router.put('/field-visits/:id', requestController.updateFieldVisit);

// Upload field photos
router.post('/field-photos', upload.array('photos'), uploadFieldPhotos);

// Get Fields
router.get('/fields', getFields);
router.post('/fields', createField);

module.exports = router;