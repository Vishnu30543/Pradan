const Settings = require('../models/Settings');

/**
 * @desc    Get system settings
 * @route   GET /api/admin/settings
 * @access  Private/Admin
 */
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update system settings
 * @route   PUT /api/admin/settings
 * @access  Private/Admin
 */
exports.updateSettings = async (req, res) => {
  try {
    // Get current settings
    let settings = await Settings.getSettings();

    // Update fields based on request body
    const {
      smsNotifications,
      emailNotifications,
      systemSettings,
      dashboardSettings
    } = req.body;

    // Update SMS notification settings
    if (smsNotifications) {
      if (smsNotifications.enabled !== undefined) {
        settings.smsNotifications.enabled = smsNotifications.enabled;
      }
      
      if (smsNotifications.templates) {
        Object.keys(smsNotifications.templates).forEach(key => {
          if (settings.smsNotifications.templates[key] !== undefined) {
            settings.smsNotifications.templates[key] = smsNotifications.templates[key];
          }
        });
      }
    }

    // Update email notification settings
    if (emailNotifications) {
      if (emailNotifications.enabled !== undefined) {
        settings.emailNotifications.enabled = emailNotifications.enabled;
      }
      
      if (emailNotifications.templates) {
        Object.keys(emailNotifications.templates).forEach(key => {
          if (settings.emailNotifications.templates[key] !== undefined) {
            settings.emailNotifications.templates[key] = emailNotifications.templates[key];
          }
        });
      }
    }

    // Update system settings
    if (systemSettings) {
      Object.keys(systemSettings).forEach(key => {
        if (settings.systemSettings[key] !== undefined) {
          settings.systemSettings[key] = systemSettings[key];
        }
      });
    }

    // Update dashboard settings
    if (dashboardSettings) {
      Object.keys(dashboardSettings).forEach(key => {
        if (settings.dashboardSettings[key] !== undefined) {
          settings.dashboardSettings[key] = dashboardSettings[key];
        }
      });
    }

    // Set updatedBy to current admin
    settings.updatedBy = req.user._id;

    // Save updated settings
    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};