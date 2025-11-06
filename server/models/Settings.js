const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema(
  {
    smsNotifications: {
      enabled: {
        type: Boolean,
        default: true
      },
      templates: {
        welcome: {
          type: String,
          default: 'Welcome to the Agricultural Management System, {{farmerName}}! Your account has been created successfully.'
        },
        requestUpdate: {
          type: String,
          default: 'Your request "{{requestTitle}}" has been updated to {{status}}.'
        },
        schemeApplication: {
          type: String,
          default: 'Your application for "{{schemeName}}" has been {{status}}.'
        }
      }
    },
    emailNotifications: {
      enabled: {
        type: Boolean,
        default: true
      },
      templates: {
        welcome: {
          type: String,
          default: 'Welcome to the Agricultural Management System, {{farmerName}}! Your account has been created successfully.'
        },
        requestUpdate: {
          type: String,
          default: 'Your request "{{requestTitle}}" has been updated to {{status}}.'
        },
        schemeApplication: {
          type: String,
          default: 'Your application for "{{schemeName}}" has been {{status}}.'
        }
      }
    },
    systemSettings: {
      maintenanceMode: {
        type: Boolean,
        default: false
      },
      version: {
        type: String,
        default: '1.0.0'
      },
      contactEmail: {
        type: String,
        default: 'support@agrimanagement.com'
      },
      contactPhone: {
        type: String,
        default: '+1234567890'
      }
    },
    dashboardSettings: {
      defaultCharts: {
        type: [String],
        default: ['farmerGrowth', 'requestDistribution', 'cropDistribution']
      },
      refreshInterval: {
        type: Number,
        default: 30 // minutes
      }
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  },
  {
    timestamps: true
  }
);

// Ensure there's only one settings document
SettingsSchema.statics.getSettings = async function() {
  const settings = await this.findOne();
  if (settings) {
    return settings;
  }
  
  // If no settings exist, create default settings
  return this.create({});
};

module.exports = mongoose.model('Settings', SettingsSchema);