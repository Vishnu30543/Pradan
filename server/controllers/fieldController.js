const Field = require('../models/Field');
const FieldPhoto = require('../models/FieldPhoto');
const Farmer = require('../models/Farmer');

/**
 * @desc    Get all fields for a farmer
 * @route   GET /api/farmer/fields
 * @access  Private/Farmer
 */
exports.getFarmerFields = async (req, res) => {
  try {
    const fields = await Field.find({ farmer: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: fields.length,
      fields
    });
  } catch (error) {
    console.error('Get farmer fields error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get field by ID
 * @route   GET /api/farmer/fields/:id
 * @access  Private/Farmer
 */
exports.getFieldById = async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Field not found'
      });
    }

    // Check if farmer owns this field
    if (field.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this field'
      });
    }

    res.status(200).json({
      success: true,
      field
    });
  } catch (error) {
    console.error('Get field by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Upload field photo
 * @route   POST /api/farmer/field-photos
 * @access  Private/Farmer
 */
exports.uploadFieldPhoto = async (req, res) => {
  try {
    const { fieldId, photoUrl, description } = req.body;

    if (!fieldId || !photoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide field ID and photo URL'
      });
    }

    // Check if field exists and belongs to farmer
    const field = await Field.findById(fieldId);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Field not found'
      });
    }

    if (field.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload photos for this field'
      });
    }

    // Create field photo
    const fieldPhoto = await FieldPhoto.create({
      field: fieldId,
      farmer: req.user._id,
      photoUrl,
      description
    });

    res.status(201).json({
      success: true,
      fieldPhoto
    });
  } catch (error) {
    console.error('Upload field photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get field photos for a farmer
 * @route   GET /api/farmer/field-photos
 * @access  Private/Farmer
 */
exports.getFieldPhotos = async (req, res) => {
  try {
    const { fieldId } = req.query;
    
    let query = { farmer: req.user._id };
    
    // If fieldId is provided, filter by field
    if (fieldId) {
      query.field = fieldId;
    }
    
    const fieldPhotos = await FieldPhoto.find(query)
      .sort({ createdAt: -1 })
      .populate('field', 'name location size crop');

    res.status(200).json({
      success: true,
      count: fieldPhotos.length,
      fieldPhotos
    });
  } catch (error) {
    console.error('Get field photos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Delete field photo
 * @route   DELETE /api/farmer/field-photos/:id
 * @access  Private/Farmer
 */
exports.deleteFieldPhoto = async (req, res) => {
  try {
    const fieldPhoto = await FieldPhoto.findById(req.params.id);

    if (!fieldPhoto) {
      return res.status(404).json({
        success: false,
        message: 'Field photo not found'
      });
    }

    // Check if farmer owns this field photo
    if (fieldPhoto.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this field photo'
      });
    }

    await fieldPhoto.remove();

    res.status(200).json({
      success: true,
      message: 'Field photo deleted successfully'
    });
  } catch (error) {
    console.error('Delete field photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};