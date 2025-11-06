const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const requestController = require('../controllers/requestController');

// Protect all routes
router.use(protect);
router.use(authorize('executive'));

// Request management routes
router.get('/requests', requestController.getExecutiveRequests);
router.get('/requests/:id', requestController.getRequestById);
router.post('/requests/:id/comment', requestController.addComment);
router.put('/requests/:id/status', requestController.updateRequestStatus);

// Scheme application routes
// Note: These routes redirect to the scheme management controller
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

// Farmer management routes
router.get('/farmers', requestController.getAssignedFarmers);
router.get('/farmers/:id', requestController.getFarmerById);

// Analytics routes
router.get('/analytics/requests', requestController.getRequestAnalytics);
router.get('/analytics/farmers', requestController.getFarmerAnalytics);

// Communication routes
router.post('/send-sms', requestController.sendSMS);
router.post('/send-notification', requestController.sendNotification);

// Field visit routes
router.get('/field-visits', requestController.getFieldVisits);
router.post('/field-visits', requestController.scheduleFieldVisit);
router.put('/field-visits/:id', requestController.updateFieldVisit);

module.exports = router;