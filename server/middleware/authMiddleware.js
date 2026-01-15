const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Executive = require('../models/Executive');
const Farmer = require('../models/Farmer');

/**
 * Middleware to protect routes - verifies JWT token and attaches user to request
 */
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Get token from cookie
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request based on role
    let user = null;

    if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.id).select('-password');
      if (user) {
        user.role = 'admin';
      }
    } else if (decoded.role === 'executive') {
      user = await Executive.findById(decoded.id).select('-password');
      if (user) {
        user.role = 'executive';
      }
    } else if (decoded.role === 'farmer') {
      user = await Farmer.findById(decoded.id).select('-password');
      if (user) {
        user.role = 'farmer';
      }
    } else {
      // Fallback to User model
      user = await User.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    req.user = user;

    // Check if user is active (only if the model has isActive field)
    if (user.isActive !== undefined && !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
      error: error.message,
    });
  }
});

/**
 * Middleware to authorize specific roles
 * @param {...String} roles - Roles to authorize
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'User role not defined',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is the owner of a resource
 * @param {String} model - Model name to check ownership against
 * @param {String} paramId - Parameter name for the resource ID
 */
exports.checkOwnership = (model, paramId = 'id') => {
  return asyncHandler(async (req, res, next) => {
    const Model = require(`../models/${model}`);
    const resourceId = req.params[paramId];

    // Find the resource
    const resource = await Model.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `${model} not found with id ${resourceId}`,
      });
    }

    // Check if user is admin (admins can access any resource)
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user is the owner of the resource
    // This assumes the resource has a 'user' or 'farmer' or 'executive' field
    // that references the user who owns it
    const ownerId =
      resource.user?.toString() ||
      resource.farmer?.toString() ||
      resource.executive?.toString();

    if (ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }

    // Attach resource to request for later use
    req.resource = resource;
    next();
  });
};