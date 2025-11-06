const mongoose = require('mongoose');

const GovernmentSchemeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide scheme title'],
      trim: true,
      maxlength: [200, 'Scheme title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide scheme description'],
      trim: true,
      maxlength: [2000, 'Scheme description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please provide scheme category'],
      enum: [
        'insurance',
        'financial-assistance',
        'credit',
        'technical-assistance',
        'infrastructure',
        'sustainable-farming',
        'marketing',
        'production',
        'development',
        'renewable-energy',
        'other',
      ],
    },
    eligibility: {
      type: [String],
      required: [true, 'Please provide eligibility criteria'],
    },
    benefits: {
      type: [String],
      required: [true, 'Please provide scheme benefits'],
    },
    applicationProcess: {
      type: [String],
      required: [true, 'Please provide application process'],
    },
    documents: {
      type: [String],
      required: [true, 'Please provide required documents'],
    },
    lastDateToApply: {
      type: Date,
      default: null, // null means ongoing scheme with no end date
    },
    contactDetails: {
      phone: {
        type: String,
        required: [true, 'Please provide contact phone number'],
      },
      email: {
        type: String,
        required: [true, 'Please provide contact email'],
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please provide a valid email',
        ],
      },
      website: {
        type: String,
        required: [true, 'Please provide website URL'],
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'upcoming'],
      default: 'active',
    },
    relevance: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    additionalInfo: {
      type: String,
      trim: true,
      maxlength: [1000, 'Additional info cannot exceed 1000 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
GovernmentSchemeSchema.index({ category: 1 });
GovernmentSchemeSchema.index({ status: 1 });
GovernmentSchemeSchema.index({ relevance: 1 });
GovernmentSchemeSchema.index({ lastDateToApply: 1 });

// Virtual for checking if scheme is active and application period is open
GovernmentSchemeSchema.virtual('isOpen').get(function () {
  if (this.status !== 'active') return false;
  if (!this.lastDateToApply) return true; // Ongoing scheme
  return new Date(this.lastDateToApply) > new Date();
});

// Method to find schemes relevant to a farmer based on their profile
GovernmentSchemeSchema.statics.findRelevantSchemes = async function (farmerProfile) {
  const query = { status: 'active' };
  
  // Filter by region if farmer has region specified
  if (farmerProfile.region) {
    query.regions = { $in: [farmerProfile.region, 'all'] };
  }
  
  // Filter by crop type if farmer has crops specified
  if (farmerProfile.crops && farmerProfile.crops.length > 0) {
    query.cropTypes = { $in: [...farmerProfile.crops, 'all'] };
  }
  
  // Only include schemes that are still open for application
  query.$or = [
    { lastDateToApply: null },
    { lastDateToApply: { $gt: new Date() } }
  ];
  
  return this.find(query).sort({ relevance: -1, createdAt: -1 });
};

module.exports = mongoose.model('GovernmentScheme', GovernmentSchemeSchema);