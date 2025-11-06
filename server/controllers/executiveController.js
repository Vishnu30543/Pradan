/**
 * This file exports executive management functions from admin.controller.js
 * to maintain compatibility with routes that expect executiveController
 */

const adminController = require('./admin.controller');

// Export executive management functions
exports.getExecutives = adminController.getExecutives;
exports.createExecutive = adminController.addExecutive;
exports.getExecutiveById = async (req, res) => {
  try {
    const executive = await require('../models/Executive').findById(req.params.id)
      .select('name email region phno assignedFarmers createdAt')
      .populate('assignedFarmers', 'name villageName');

    if (!executive) {
      return res.status(404).json({
        success: false,
        message: 'Executive not found'
      });
    }

    res.status(200).json({
      success: true,
      executive
    });
  } catch (error) {
    console.error('Get executive by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
exports.updateExecutive = async (req, res) => {
  try {
    const { name, email, phno, region } = req.body;
    const executive = await require('../models/Executive').findById(req.params.id);

    if (!executive) {
      return res.status(404).json({
        success: false,
        message: 'Executive not found'
      });
    }

    // Update fields
    if (name) executive.name = name;
    if (email) executive.email = email;
    if (phno) executive.phno = phno;
    if (region) executive.region = region;

    await executive.save();

    res.status(200).json({
      success: true,
      message: 'Executive updated successfully',
      executive: {
        id: executive._id,
        name: executive.name,
        email: executive.email,
        region: executive.region,
        phno: executive.phno
      }
    });
  } catch (error) {
    console.error('Update executive error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
exports.deleteExecutive = adminController.removeExecutive;