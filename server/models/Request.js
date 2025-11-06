const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  farmer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Farmer',
    required: [true, 'Farmer ID is required']
  },
  title: {
    type: String,
    required: [true, 'Request title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Request description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: [
      'technical-support',
      'financial-assistance',
      'crop-disease',
      'irrigation-issue',
      'equipment-problem',
      'market-access',
      'training-request',
      'other'
    ],
    required: [true, 'Request category is required']
  },
  attachments: [{
    fileName: String,
    filePath: String,
    fileType: String,
    uploadDate: { 
      type: Date, 
      default: Date.now 
    }
  }],
  assignedExecutive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Executive'
  },
  comments: [{
    text: {
      type: String,
      required: true
    },
    postedBy: {
      type: String,
      enum: ['farmer', 'executive', 'admin'],
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    userName: String,
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  resolvedDate: Date,
  expectedResolutionDate: Date
}, {
  timestamps: true
});

// Add index for faster queries
RequestSchema.index({ farmer: 1, status: 1 });
RequestSchema.index({ assignedExecutive: 1, status: 1 });
RequestSchema.index({ category: 1 });
RequestSchema.index({ createdAt: -1 });

// Virtual for request age in days
RequestSchema.virtual('ageInDays').get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to add a comment to a request
RequestSchema.methods.addComment = function (text, postedBy, userId, userName) {
  this.comments.push({
    text,
    postedBy,
    userId,
    userName,
    createdAt: Date.now(),
  });
  return this.save();
};

// Method to update request status
RequestSchema.methods.updateStatus = function (newStatus, resolvedDate = null) {
  this.status = newStatus;
  if (newStatus === 'resolved' && resolvedDate) {
    this.resolvedDate = resolvedDate;
  }
  return this.save();
};

// Static method to get requests statistics
RequestSchema.statics.getRequestStats = async function (executiveId = null) {
  const matchStage = executiveId ? { assignedExecutive: mongoose.Types.ObjectId(executiveId) } : {};
  
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

module.exports = mongoose.model('Request', RequestSchema);