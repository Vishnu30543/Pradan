const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const schemeManagementController = require('../controllers/schemeManagementController');

// Protect all routes
router.use(protect);

// Routes for both admin and executive
router.get(
  '/scheme-applications',
  authorize('admin', 'executive'),
  schemeManagementController.getSchemeApplications
);

router.get(
  '/scheme-applications/:id',
  authorize('admin', 'executive'),
  schemeManagementController.getApplicationById
);

router.put(
  '/scheme-applications/:id/status',
  authorize('admin', 'executive'),
  schemeManagementController.updateApplicationStatus
);

router.put(
  '/scheme-applications/:id/verify-documents',
  authorize('admin', 'executive'),
  schemeManagementController.verifyApplicationDocuments
);

// Admin-only routes
router.get(
  '/schemes',
  authorize('admin'),
  schemeManagementController.getAllSchemes
);

router.get(
  '/schemes/:id',
  authorize('admin'),
  schemeManagementController.getSchemeById
);

router.post(
  '/schemes',
  authorize('admin'),
  schemeManagementController.createScheme
);

router.put(
  '/schemes/:id',
  authorize('admin'),
  schemeManagementController.updateScheme
);

router.delete(
  '/schemes/:id',
  authorize('admin'),
  schemeManagementController.deleteScheme
);

router.put(
  '/scheme-applications/:id/assign',
  authorize('admin'),
  schemeManagementController.assignApplicationToExecutive
);

router.get(
  '/scheme-applications/stats',
  authorize('admin'),
  schemeManagementController.getApplicationStats
);

module.exports = router;