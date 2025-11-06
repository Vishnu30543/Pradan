const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide a field name'],
      trim: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      },
      address: {
        type: String,
        required: [true, 'Please provide field address']
      },
      village: String,
      district: String,
      state: String,
      pincode: String
    },
    size: {
      value: {
        type: Number,
        required: [true, 'Please provide field size']
      },
      unit: {
        type: String,
        enum: ['acres', 'hectares', 'bigha', 'gunta'],
        default: 'acres'
      }
    },
    soilType: {
      type: String,
      enum: ['clay', 'sandy', 'silty', 'loamy', 'peaty', 'chalky', 'other'],
      default: 'other'
    },
    irrigationSource: {
      type: String,
      enum: ['rainfed', 'canal', 'well', 'borewell', 'pond', 'river', 'other'],
      default: 'rainfed'
    },
    crop: {
      current: String,
      previous: [String],
      plannedNext: String
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FieldStatus'
    },
    ownership: {
      type: String,
      enum: ['owned', 'leased', 'shared'],
      default: 'owned'
    },
    carbonCredits: {
      total: {
        type: Number,
        default: 0
      },
      available: {
        type: Number,
        default: 0
      },
      redeemed: {
        type: Number,
        default: 0
      },
      lastUpdated: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create index for geospatial queries
FieldSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for field photos
FieldSchema.virtual('photos', {
  ref: 'FieldPhoto',
  localField: '_id',
  foreignField: 'field',
  justOne: false
});

module.exports = mongoose.model('Field', FieldSchema);