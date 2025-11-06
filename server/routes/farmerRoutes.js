const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const farmerController = require('../controllers/farmerController');
const requestController = require('../controllers/requestController');
const fieldController = require('../controllers/fieldController');
const governmentSchemeController = require('../controllers/governmentSchemeController');

// Protect all routes
router.use(protect);
router.use(authorize('farmer'));

// Profile routes
router.get('/profile', farmerController.getFarmerProfile);
router.put('/profile', farmerController.updateFarmerProfile);
router.get('/carbon-credits', farmerController.getCarbonCredits);
router.get('/field-status', farmerController.getFieldStatus);
router.get('/income', farmerController.getIncome);
router.get('/notifications', farmerController.getNotifications);

// Field routes
router.get('/fields', fieldController.getFarmerFields);
router.get('/fields/:id', fieldController.getFieldById);
router.post('/field-photos', fieldController.uploadFieldPhoto);
router.get('/field-photos', fieldController.getFieldPhotos);
router.delete('/field-photos/:id', fieldController.deleteFieldPhoto);

// Request routes
router.get('/requests', requestController.getFarmerRequests);
router.post('/requests', requestController.createRequest);
router.get('/requests/:id', requestController.getRequestById);
router.put('/requests/:id', requestController.updateRequest);
router.post('/requests/:id/comment', requestController.addComment);

// Government scheme routes
router.get('/government-schemes', governmentSchemeController.getGovernmentSchemes);
router.get('/government-schemes/relevant', governmentSchemeController.getRelevantSchemes);
router.post('/government-schemes/save', governmentSchemeController.saveScheme);
router.delete('/government-schemes/save/:schemeId', governmentSchemeController.unsaveScheme);
router.post('/government-schemes/apply', governmentSchemeController.applyForScheme);
router.get('/government-schemes/applications', governmentSchemeController.getSchemeApplications);

module.exports = router;