const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const FarmerSchema = new mongoose.Schema({
  // Basic Information
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true
  },
  fatherOrHusbandName: { 
    type: String, 
    required: [true, 'Father or husband name is required'],
    trim: true
  },
  mobileNo: { 
    type: String, 
    required: [true, 'Mobile number is required'], 
    unique: true,
    trim: true
  },
  email: { 
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries
  },
  
  // Personal Information
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: function() {
      return this.isWomenFarmer === undefined;
    }
  },
  isWomenFarmer: { 
    type: String, 
    enum: ['yes', 'no'], 
    default: 'no' 
  },
  age: {
    type: Number,
    min: [18, 'Age must be at least 18'],
    max: [120, 'Age cannot exceed 120']
  },
  caste: { 
    type: String,
    trim: true
  },
  educationLevel: {
    type: String,
    enum: ['none', 'primary', 'secondary', 'higher-secondary', 'graduate', 'post-graduate']
  },
  familySize: Number,
  farmingExperience: Number, // in years
  aadhaarNumber: {
    type: String,
    match: [/^\d{12}$/, 'Aadhaar number must be 12 digits']
  },
  
  // Address Information
  villageName: { 
    type: String, 
    required: [true, 'Village name is required'],
    trim: true
  },
  panchayatName: { 
    type: String, 
    required: [true, 'Panchayat name is required'],
    trim: true
  },
  address: {
    district: String,
    state: String,
    pincode: String
  },
  groupName: { 
    type: String,
    trim: true
  },
  
  // Financial Information
  creditScore: { 
    type: Number, 
    default: 0 
  },
  income: { 
    type: Number, 
    default: 0 
  },
  estimatedIncome: { 
    type: Number, 
    default: 0 
  },
  incomeDetails: [
    {
      year: Number,
      season: {
        type: String,
        enum: ['kharif', 'rabi', 'zaid', 'annual']
      },
      amount: Number,
      source: {
        type: String,
        enum: ['crop', 'livestock', 'other'],
        default: 'crop'
      },
      notes: String
    }
  ],
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    bankName: String,
    branchName: String,
    ifscCode: String
  },
  
  // Farm Information
  farmDetails: [
    {
      landSize: {
        type: Number,
        min: [0.1, 'Land size must be at least 0.1 acres']
      },
      landUnit: {
        type: String,
        enum: ['acres', 'hectares', 'bigha'],
        default: 'acres'
      },
      soilType: {
        type: String,
        enum: ['clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky', 'other']
      },
      irrigationSource: {
        type: String,
        enum: ['canal', 'well', 'borewell', 'rain', 'pond', 'river', 'other']
      },
      ownership: {
        type: String,
        enum: ['owned', 'leased', 'shared'],
        default: 'owned'
      },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        }
      }
    }
  ],
  cropData: { 
    type: String 
  },
  crops: [
    {
      name: String,
      variety: String,
      season: {
        type: String,
        enum: ['kharif', 'rabi', 'zaid', 'perennial']
      },
      sowingDate: Date,
      harvestDate: Date,
      expectedYield: Number,
      actualYield: Number
    }
  ],
  plants: [String],
  isOrganicFarming: Boolean,
  hasFarmEquipment: Boolean,
  equipmentDetails: [String],
  
  // Field Status
  fieldStatus: {
    type: String,
    enum: ['healthy', 'moderate', 'critical', 'unknown'],
    default: 'unknown'
  },
  fieldPhotos: [{ 
    url: String,
    caption: String,
    uploadedAt: { type: Date, default: Date.now }, 
    uploadedBy: { type: String, enum: ['farmer', 'executive'] },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number]
      }
    }
  }],
  
  // Relationships
  requests: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Request' 
  }],
  assignedExecutive: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Executive' 
  },
  
  // Government Schemes
  savedSchemes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GovernmentScheme'
    }
  ],
  
  // Preferences
  preferredLanguage: {
    type: String,
    default: 'english'
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
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Encrypt password using bcrypt before saving
FarmerSchema.pre('save', async function(next) {
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
FarmerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual for total land size
FarmerSchema.virtual('totalLandSize').get(function () {
  if (!this.farmDetails || this.farmDetails.length === 0) return 0;
  
  return this.farmDetails.reduce((total, farm) => {
    // Convert all to acres for consistency
    let sizeInAcres = farm.landSize;
    if (farm.landUnit === 'hectares') {
      sizeInAcres = farm.landSize * 2.47105; // 1 hectare = 2.47105 acres
    } else if (farm.landUnit === 'bigha') {
      sizeInAcres = farm.landSize * 0.625; // 1 bigha = 0.625 acres (approx, varies by region)
    }
    return total + sizeInAcres;
  }, 0);
});

// Virtual for average annual income
FarmerSchema.virtual('averageAnnualIncome').get(function () {
  if (!this.incomeDetails || this.incomeDetails.length === 0) {
    // If no income details, use the income field
    return this.income || 0;
  }
  
  const annualIncomes = {};
  
  this.incomeDetails.forEach(income => {
    if (income.year) {
      if (!annualIncomes[income.year]) {
        annualIncomes[income.year] = 0;
      }
      annualIncomes[income.year] += income.amount || 0;
    }
  });
  
  const years = Object.keys(annualIncomes);
  if (years.length === 0) return this.income || 0;
  
  const totalIncome = years.reduce((sum, year) => sum + annualIncomes[year], 0);
  return totalIncome / years.length;
});

// Virtual for scheme applications
FarmerSchema.virtual('schemeApplications', {
  ref: 'SchemeApplication',
  localField: '_id',
  foreignField: 'farmer',
  justOne: false
});

// Update the updatedAt field before saving
FarmerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better query performance
FarmerSchema.index({ mobileNo: 1 });
FarmerSchema.index({ email: 1 });
FarmerSchema.index({ assignedExecutive: 1 });
FarmerSchema.index({ fieldStatus: 1 });
FarmerSchema.index({ villageName: 1, panchayatName: 1 });
FarmerSchema.index({ 'address.state': 1, 'address.district': 1 });
FarmerSchema.index({ 'farmDetails.location': '2dsphere' });

module.exports = mongoose.model('Farmer', FarmerSchema);