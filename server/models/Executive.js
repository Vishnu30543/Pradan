const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ExecutiveSchema = new mongoose.Schema({
  // Basic Information
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ],
    lowercase: true
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries
  },
  phno: { 
    type: Number, 
    required: [true, 'Phone number is required']
  },
  
  // Profile Information
  profilePhoto: {
    type: String,
    default: 'default-profile.jpg'
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  address: {
    street: String,
    city: String,
    district: String,
    state: String,
    pincode: String
  },
  
  // Work Information
  employeeId: {
    type: String,
    unique: true
  },
  designation: {
    type: String,
    default: 'Field Executive'
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  region: { 
    type: String, 
    required: [true, 'Region is required'],
    trim: true
  },
  assignedAreas: [{
    district: String,
    blocks: [String],
    villages: [String]
  }],
  
  // Status Information
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  
  // Performance Metrics
  performanceMetrics: {
    requestsResolved: {
      type: Number,
      default: 0
    },
    averageResolutionTime: {
      type: Number, // in hours
      default: 0
    },
    farmerRatings: {
      type: Number, // average rating out of 5
      default: 0,
      min: 0,
      max: 5
    },
    fieldVisitsCompleted: {
      type: Number,
      default: 0
    }
  },
  
  // Specializations
  specializations: [{
    type: String,
    enum: [
      'crop-management',
      'pest-control',
      'irrigation',
      'soil-health',
      'organic-farming',
      'financial-assistance',
      'government-schemes',
      'technology-adoption'
    ]
  }],
  
  // Communication Logs
  fieldLogs: { 
    type: String 
  },
  smsLogs: [{ 
    message: String, 
    sentTo: [String], 
    timestamp: { type: Date, default: Date.now } 
  }],
  
  // Relationships
  assignedFarmers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Farmer' 
  }],
  
  // Preferences
  preferredLanguage: {
    type: String,
    default: 'english'
  },
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: true
    },
    app: {
      type: Boolean,
      default: true
    }
  },
  
  // Timestamps
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Encrypt password using bcrypt before saving
ExecutiveSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if entered password matches with stored hashed password
ExecutiveSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual for pending requests
ExecutiveSchema.virtual('pendingRequests', {
  ref: 'Request',
  localField: '_id',
  foreignField: 'assignedExecutive',
  justOne: false,
  match: { status: { $in: ['pending', 'in-progress'] } }
});

// Method to update last active timestamp
ExecutiveSchema.methods.updateLastActive = async function() {
  this.lastActive = Date.now();
  await this.save();
};

// Update the updatedAt field before saving
ExecutiveSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better query performance
ExecutiveSchema.index({ email: 1 });
ExecutiveSchema.index({ phno: 1 });
ExecutiveSchema.index({ employeeId: 1 });
ExecutiveSchema.index({ region: 1 });
ExecutiveSchema.index({ 'assignedAreas.district': 1 });
ExecutiveSchema.index({ isActive: 1 });

module.exports = mongoose.model('Executive', ExecutiveSchema);