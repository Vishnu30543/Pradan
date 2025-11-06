const mongoose = require('mongoose');

const FieldPhotoSchema = new mongoose.Schema(
  {
    field: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Field',
      required: true
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true
    },
    photoUrl: {
      type: String,
      required: [true, 'Please provide photo URL']
    },
    description: {
      type: String,
      trim: true
    },
    tags: [String],
    metadata: {
      captureDate: Date,
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: [Number]
      },
      device: String,
      size: Number,
      format: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Executive'
    },
    verificationDate: Date
  },
  {
    timestamps: true
  }
);

// Pre-remove hook to delete the actual file from storage if needed
// This would be implemented if using a file storage service
/*
FieldPhotoSchema.pre('remove', async function(next) {
  // Code to delete the file from storage
  next();
});
*/

module.exports = mongoose.model('FieldPhoto', FieldPhotoSchema);