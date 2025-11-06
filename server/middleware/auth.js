const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Executive = require('../models/Executive');
const Farmer = require('../models/Farmer');

// Protect routes - verify token
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set user based on role
    if (decoded.role === 'admin') {
      req.user = await Admin.findById(decoded.id);
      req.role = 'admin';
    } else if (decoded.role === 'executive') {
      req.user = await Executive.findById(decoded.id);
      req.role = 'executive';
    } else if (decoded.role === 'farmer') {
      req.user = await Farmer.findById(decoded.id);
      req.role = 'farmer';
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
      error: error.message
    });
  }
};

// Authorize by role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };