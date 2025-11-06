const mongoose = require('mongoose');

const FieldStatusSchema = new mongoose.Schema({
  farmerID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Farmer', 
    required: [true, 'Farmer ID is required'] 
  },
  GISCoordinates: { 
    latitude: Number, 
    longitude: Number 
  },
  healthStatus: { 
    type: String, 
    enum: ['red', 'yellow', 'green'], 
    default: 'green' 
  },
  soilHealth: { 
    type: String 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
  notes: { 
    type: String 
  }
});

module.exports = mongoose.model('FieldStatus', FieldStatusSchema);