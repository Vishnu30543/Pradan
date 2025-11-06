const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./authRoutes');
const farmerRoutes = require('./farmerRoutes');
const executiveRoutes = require('./executiveRoutes');
const adminRoutes = require('./adminRoutes');
const schemeManagementRoutes = require('./schemeManagementRoutes');

// Mount routes
router.use('/api/auth', authRoutes);
router.use('/api/farmer', farmerRoutes);
router.use('/api/executive', executiveRoutes);
router.use('/api/admin', adminRoutes);
router.use('/api/scheme-management', schemeManagementRoutes);

// Health check route
router.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// 404 route
router.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = router;