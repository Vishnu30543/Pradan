const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

// Public routes
router.post('/register/farmer', authController.registerFarmer);
router.post('/register/executive', authController.registerExecutive);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:resetToken', authController.resetPassword);

// Protected routes
router.use(protect);
router.get('/me', authController.getMe);
router.put('/update-profile', authController.updateProfile);
router.put('/update-password', authController.updatePassword);
router.post('/logout', authController.logout);

module.exports = router;