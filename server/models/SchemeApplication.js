const mongoose = require('mongoose');

const SchemeApplicationSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GovernmentScheme',
      required: true,
    },
    applicationId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'under-review', 'approved', 'rejected', 'on-hold'],
      default: 'pending',
    },
    documents: [
      {
        name: {
          type: String,
          required: true,
        },
        filePath: {
          type: String,
          required: true,
        },
        fileType: {
          type: String,
          required: true,
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
        verified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    remarks: {
      type: String,
      trim: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewDate: {
      type: Date,
    },
    history: [
      {
        status: {
          type: String,
          enum: ['pending', 'under-review', 'approved', 'rejected', 'on-hold'],
          required: true,
        },
        remarks: {
          type: String,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Index for faster queries
SchemeApplicationSchema.index({ farmer: 1 });
SchemeApplicationSchema.index({ scheme: 1 });
SchemeApplicationSchema.index({ status: 1 });
SchemeApplicationSchema.index({ applicationId: 1 }, { unique: true });

// Method to update application status
SchemeApplicationSchema.methods.updateStatus = async function (status, remarks, userId) {
  // Update the current status
  this.status = status;
  if (remarks) this.remarks = remarks;
  
  // If approved or rejected, set review date and reviewer
  if (status === 'approved' || status === 'rejected') {
    this.reviewDate = Date.now();
    this.reviewedBy = userId;
  }
  
  // Add to history
  this.history.push({
    status,
    remarks,
    updatedBy: userId,
    updatedAt: Date.now(),
  });
  
  return this.save();
};

// Static method to get application statistics
SchemeApplicationSchema.statics.getApplicationStats = async function (farmerId = null) {
  const matchStage = farmerId ? { farmer: mongoose.Types.ObjectId(farmerId) } : {};
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        status: '$_id',
        count: 1,
        _id: 0,
      },
    },
  ]);
};

// Generate a unique application ID before saving
SchemeApplicationSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.applicationId = `APP-${Date.now().toString().slice(-6)}${count}`;
  }
  next();
});

module.exports = mongoose.model('SchemeApplication', SchemeApplicationSchema);