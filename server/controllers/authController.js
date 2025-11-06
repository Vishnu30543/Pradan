const Admin = require('../models/Admin');
const Executive = require('../models/Executive');
const Farmer = require('../models/Farmer');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');

/**
 * @desc    Register a new farmer
 * @route   POST /api/auth/register/farmer
 * @access  Public
 */
exports.registerFarmer = async (req, res) => {
  try {
    const { name, email, password, phone, address, landDetails } = req.body;

    // Check if farmer already exists
    const farmerExists = await Farmer.findOne({ email });
    if (farmerExists) {
      return res.status(400).json({
        success: false,
        message: 'Farmer already exists'
      });
    }

    // Create new farmer
    const farmer = await Farmer.create({
      name,
      email,
      password,
      phone,
      address,
      landDetails
    });

    if (farmer) {
      // Generate token
      const token = generateToken(farmer._id, 'farmer');

      res.status(201).json({
        success: true,
        token,
        farmer: {
          id: farmer._id,
          name: farmer.name,
          email: farmer.email,
          role: 'farmer'
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid farmer data'
      });
    }
  } catch (error) {
    console.error('Register farmer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Register a new executive
 * @route   POST /api/auth/register/executive
 * @access  Public
 */
exports.registerExecutive = async (req, res) => {
  try {
    const { name, email, password, phone, department, designation } = req.body;

    // Check if executive already exists
    const executiveExists = await Executive.findOne({ email });
    if (executiveExists) {
      return res.status(400).json({
        success: false,
        message: 'Executive already exists'
      });
    }

    // Create new executive
    const executive = await Executive.create({
      name,
      email,
      password,
      phone,
      department,
      designation
    });

    if (executive) {
      // Generate token
      const token = generateToken(executive._id, 'executive');

      res.status(201).json({
        success: true,
        token,
        executive: {
          id: executive._id,
          name: executive.name,
          email: executive.email,
          role: 'executive'
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid executive data'
      });
    }
  } catch (error) {
    console.error('Register executive error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Login user (admin, executive, farmer)
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate input
    if ((!username && !email) || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide login credentials and role'
      });
    }

    let user;
    let token;
    let userData;

    // Check based on role
    if (role === 'admin') {
      if (!username) {
        return res.status(400).json({
          success: false,
          message: 'Please provide adminname'
        });
      }

      // Check if admin exists
      user = await Admin.findOne({ adminname: username });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate token
      token = generateToken(user._id, 'admin');
      userData = {
        id: user._id,
        name: user.name,
        adminname: user.adminname,
        role: 'admin'
      };
    } else if (role === 'executive') {
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email'
        });
      }

      // Check if executive exists
      user = await Executive.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate token
      token = generateToken(user._id, 'executive');
      userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: 'executive'
      };
    } else if (role === 'farmer') {
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email'
        });
      }

      // Check if farmer exists
      user = await Farmer.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate token
      token = generateToken(user._id, 'farmer');
      userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: 'farmer'
      };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    res.status(200).json({
      success: true,
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    let user;
    const role = req.user.role;

    if (role === 'admin') {
      user = await Admin.findById(req.user.id).select('-password');
    } else if (role === 'executive') {
      user = await Executive.findById(req.user.id).select('-password');
    } else if (role === 'farmer') {
      user = await Farmer.findById(req.user.id)
        .select('-password')
        .populate('assignedExecutive', 'name email phone');
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        role
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/update-profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    let user;
    const role = req.user.role;
    const { name, email, phone, address } = req.body;

    // Update based on role
    if (role === 'admin') {
      user = await Admin.findByIdAndUpdate(
        req.user.id,
        { name },
        { new: true }
      ).select('-password');
    } else if (role === 'executive') {
      user = await Executive.findByIdAndUpdate(
        req.user.id,
        { name, email, phone },
        { new: true }
      ).select('-password');
    } else if (role === 'farmer') {
      user = await Farmer.findByIdAndUpdate(
        req.user.id,
        { name, email, phone, address },
        { new: true }
      ).select('-password');
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update password
 * @route   PUT /api/auth/update-password
 * @access  Private
 */
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const role = req.user.role;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    let user;

    // Get user based on role
    if (role === 'admin') {
      user = await Admin.findById(req.user.id);
    } else if (role === 'executive') {
      user = await Executive.findById(req.user.id);
    } else if (role === 'farmer') {
      user = await Farmer.findById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if current password matches
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and role'
      });
    }

    let user;

    // Find user based on role
    if (role === 'executive') {
      user = await Executive.findOne({ email });
    } else if (role === 'farmer') {
      user = await Farmer.findOne({ email });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    // In a real application, send email with reset URL
    // For demo purposes, just return the token
    res.status(200).json({
      success: true,
      message: 'Password reset token generated',
      resetToken,
      resetUrl
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Reset password
 * @route   PUT /api/auth/reset-password/:resetToken
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { password, role } = req.body;
    const { resetToken } = req.params;

    if (!password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide password and role'
      });
    }

    // Hash the reset token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    let user;

    // Find user with valid token based on role
    if (role === 'executive') {
      user = await Executive.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
      });
    } else if (role === 'farmer') {
      user = await Farmer.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Set new password and clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate new token
    const token = generateToken(user._id, role);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      token
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res) => {
  try {
    // In a real application with cookies, clear the cookie
    // res.cookie('token', 'none', {
    //   expires: new Date(Date.now() + 10 * 1000),
    //   httpOnly: true
    // });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};