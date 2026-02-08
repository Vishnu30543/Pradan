const Farmer = require('../models/Farmer');
const Request = require('../models/Request');
const FieldStatus = require('../models/FieldStatus');
const generateToken = require('../utils/generateToken');
const upload = require('../utils/fileUpload');

/**
 * @desc    Get farmer profile
 * @route   GET /api/farmer/profile
 * @access  Private/Farmer
 */
const getFarmerProfile = async (req, res) => {
  try {
    // Get farmer and field status in parallel for better performance
    const [farmer, fieldStatus] = await Promise.all([
      Farmer.findById(req.user._id)
        .select('-password')
        .populate('assignedExecutive', 'name email phno'),
      FieldStatus.findOne({ farmerID: req.user._id })
    ]);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.status(200).json({
      success: true,
      farmer,
      fieldStatus
    });
  } catch (error) {
    console.error('Get farmer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update farmer profile
 * @route   PUT /api/farmer/profile
 * @access  Private/Farmer
 */
const updateFarmerProfile = async (req, res) => {
  try {
    const {
      name,
      fatherOrHusbandName,
      email,
      caste,
      isWomenFarmer,
      villageName,
      panchayatName,
      groupName,
      plants,
      cropData,
      landSize
    } = req.body;

    // Find farmer
    const farmer = await Farmer.findById(req.user._id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Update fields if provided
    if (name) farmer.name = name;
    if (fatherOrHusbandName) farmer.fatherOrHusbandName = fatherOrHusbandName;
    if (email) farmer.email = email;
    if (caste) farmer.caste = caste;
    if (isWomenFarmer) farmer.isWomenFarmer = isWomenFarmer;
    if (villageName) farmer.villageName = villageName;
    if (panchayatName) farmer.panchayatName = panchayatName;
    if (groupName) farmer.groupName = groupName;
    if (plants) farmer.plants = plants;
    if (cropData) farmer.cropData = cropData;
    if (landSize) farmer.landSize = landSize;

    // Save updated farmer
    await farmer.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      farmer: {
        id: farmer._id,
        name: farmer.name,
        email: farmer.email,
        villageName: farmer.villageName,
        panchayatName: farmer.panchayatName
      }
    });
  } catch (error) {
    console.error('Update farmer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Upload field pictures
 * @route   POST /api/farmer/field-photos
 * @access  Private/Farmer
 */
const uploadFieldPhotos = async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one photo'
      });
    }

    // Find farmer
    const farmer = await Farmer.findById(req.user._id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Process uploaded files
    const uploadedPhotos = req.files.map(file => ({
      url: `/uploads/images/${file.filename}`,
      uploadedAt: Date.now(),
      uploadedBy: 'farmer'
    }));

    // Add photos to farmer's record
    farmer.fieldPhotos.push(...uploadedPhotos);
    await farmer.save();

    // Update field status if provided
    if (req.body.healthStatus) {
      let fieldStatus = await FieldStatus.findOne({ farmerID: farmer._id });

      if (!fieldStatus) {
        fieldStatus = new FieldStatus({
          farmerID: farmer._id,
          healthStatus: req.body.healthStatus
        });
      } else {
        fieldStatus.healthStatus = req.body.healthStatus;
        fieldStatus.lastUpdated = Date.now();
      }

      await fieldStatus.save();
    }

    res.status(200).json({
      success: true,
      message: 'Field photos uploaded successfully',
      photos: uploadedPhotos
    });
  } catch (error) {
    console.error('Upload field photos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Create and raise new request
 * @route   POST /api/farmer/request
 * @access  Private/Farmer
 */
const createRequest = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    // Validate input
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and category'
      });
    }

    // Find farmer
    const farmer = await Farmer.findById(req.user._id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Create new request
    const request = await Request.create({
      farmer: farmer._id,
      title,
      description,
      category,
      priority: priority || 'medium',
      assignedExecutive: farmer.assignedExecutive
    });

    // Add request to farmer's requests array
    farmer.requests.push(request._id);
    await farmer.save();

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      request: {
        id: request._id,
        title: request.title,
        status: request.status,
        createdAt: request.createdAt
      }
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all farmer's requests with status
 * @route   GET /api/farmer/requests
 * @access  Private/Farmer
 */
const getRequests = async (req, res) => {
  try {
    // Find farmer
    const farmer = await Farmer.findById(req.user._id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Get requests
    const requests = await Request.find({ farmer: farmer._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    View earned carbon credits
 * @route   GET /api/farmer/carbon-credits
 * @access  Private/Farmer
 */
const getCarbonCredits = async (req, res) => {
  try {
    // Find farmer
    const farmer = await Farmer.findById(req.user._id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Calculate carbon credits based on plants (simplified example)
    const plantCount = farmer.plants ? farmer.plants.length : 0;
    const creditValue = plantCount * 0.5; // Simplified calculation

    // In a real system, this would fetch from a database or calculate based on actual data
    // For this demo, we'll generate placeholder data
    const carbonCredits = {
      totalCredits: creditValue,
      monthlyEarnings: creditValue / 12,
      plantCount,
      history: [
        {
          month: 'January',
          credits: creditValue / 12
        },
        {
          month: 'February',
          credits: creditValue / 12
        },
        {
          month: 'March',
          credits: creditValue / 12
        }
      ]
    };

    res.status(200).json({
      success: true,
      carbonCredits
    });
  } catch (error) {
    console.error('Get carbon credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get current field status
 * @route   GET /api/farmer/field-status
 * @access  Private/Farmer
 */
const getFieldStatus = async (req, res) => {
  try {
    // Run queries in parallel
    const [farmer, fieldStatus] = await Promise.all([
      Farmer.findById(req.user._id),
      FieldStatus.findOne({ farmerID: req.user._id })
    ]);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Get field photos
    const fieldPhotos = farmer.fieldPhotos || [];

    // If no field status exists, create one (this part remains sequential as it depends on check)
    let finalFieldStatus = fieldStatus;
    if (!finalFieldStatus) {
      finalFieldStatus = await FieldStatus.create({
        farmerID: farmer._id,
        healthStatus: 'green',
        notes: 'Initial field status'
      });
    }

    res.status(200).json({
      success: true,
      fieldStatus: finalFieldStatus,
      fieldPhotos: fieldPhotos.slice(-5) // Get last 5 photos
    });
  } catch (error) {
    console.error('Get field status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Income tracking and history
 * @route   GET /api/farmer/income
 * @access  Private/Farmer
 */
const getIncome = async (req, res) => {
  try {
    // Find farmer
    const farmer = await Farmer.findById(req.user._id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // In a real system, this would fetch from a database with actual income history
    // For this demo, we'll generate placeholder data
    const incomeData = {
      currentIncome: farmer.income,
      estimatedIncome: farmer.estimatedIncome,
      difference: farmer.estimatedIncome - farmer.income,
      percentAchieved: farmer.estimatedIncome > 0
        ? (farmer.income / farmer.estimatedIncome) * 100
        : 0,
      history: [
        {
          month: 'January',
          income: farmer.income / 3
        },
        {
          month: 'February',
          income: farmer.income / 3
        },
        {
          month: 'March',
          income: farmer.income / 3
        }
      ]
    };

    res.status(200).json({
      success: true,
      incomeData
    });
  } catch (error) {
    console.error('Get income error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get SMS notifications received
 * @route   GET /api/farmer/notifications
 * @access  Private/Farmer
 */
const getNotifications = async (req, res) => {
  try {
    // Find farmer
    const farmer = await Farmer.findById(req.user._id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Get executive to access SMS logs
    const executive = await Executive.findById(farmer.assignedExecutive);
    if (!executive) {
      return res.status(404).json({
        success: false,
        message: 'Assigned executive not found'
      });
    }

    // Filter SMS logs for this farmer
    const notifications = executive.smsLogs.filter(log => {
      return log.sentTo.includes(farmer.mobileNo);
    }).map(log => ({
      message: log.message,
      timestamp: log.timestamp
    }));

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update request status
 * @route   PUT /api/farmer/request/:id/status
 * @access  Private/Farmer
 */
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate input
    if (!status || !['completed', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid status (completed or pending)'
      });
    }

    // Find request
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if request belongs to farmer
    if (request.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    // Update status
    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request status updated successfully',
      request: {
        id: request._id,
        title: request.title,
        status: request.status,
        updatedAt: request.updatedAt
      }
    });
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all farmers
 * @route   GET /api/admin/farmers
 * @access  Private/Admin
 */
const getFarmers = async (req, res) => {
  try {
    const farmersDoc = await Farmer.find()
      .populate('assignedExecutive', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    // Optimize: Fetch all field statuses in one query instead of N+1 queries
    const farmerIds = farmersDoc.map(f => f._id);
    const fieldStatuses = await FieldStatus.find({ farmerID: { $in: farmerIds } }).lean();

    // Create a map for O(1) lookup
    const statusMap = {};
    fieldStatuses.forEach(status => {
      statusMap[status.farmerID.toString()] = status;
    });

    // Attach field status to each farmer
    const farmers = farmersDoc.map(farmer => {
      return {
        ...farmer,
        fieldStatus: statusMap[farmer._id.toString()] || { healthStatus: 'unknown' }
      };
    });

    res.status(200).json({
      success: true,
      count: farmers.length,
      farmers
    });
  } catch (error) {
    console.error('Get farmers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get farmer by ID
 * @route   GET /api/admin/farmers/:id
 * @access  Private/Admin
 */
const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id)
      .populate('assignedExecutive', 'name email phone');

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.status(200).json({
      success: true,
      farmer
    });
  } catch (error) {
    console.error('Get farmer by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update farmer
 * @route   PUT /api/admin/farmers/:id
 * @access  Private/Admin
 */
const updateFarmer = async (req, res) => {
  try {
    const { name, villageName, panchayatName, mobileNo, assignedExecutive } = req.body;

    let farmer = await Farmer.findById(req.params.id);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Update fields
    farmer.name = name || farmer.name;
    farmer.villageName = villageName || farmer.villageName;
    farmer.panchayatName = panchayatName || farmer.panchayatName;
    farmer.mobileNo = mobileNo || farmer.mobileNo;

    if (assignedExecutive) {
      // Verify executive exists
      const executive = await Executive.findById(assignedExecutive);
      if (!executive) {
        return res.status(400).json({
          success: false,
          message: 'Executive not found'
        });
      }
      farmer.assignedExecutive = assignedExecutive;
    }

    await farmer.save();

    res.status(200).json({
      success: true,
      message: 'Farmer updated successfully',
      farmer
    });
  } catch (error) {
    console.error('Update farmer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Delete farmer
 * @route   DELETE /api/admin/farmers/:id
 * @access  Private/Admin
 */
const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Delete farmer
    await farmer.remove();

    res.status(200).json({
      success: true,
      message: 'Farmer deleted successfully'
    });
  } catch (error) {
    console.error('Delete farmer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Generate farmer report
 * @route   GET /api/admin/farmer-report
 * @access  Private/Admin
 */
const generateFarmerReport = async (req, res) => {
  try {
    // Get all farmers with selected fields
    const farmers = await Farmer.find()
      .select('name villageName panchayatName mobileNo income estimatedIncome plants assignedExecutive createdAt')
      .populate('assignedExecutive', 'name email');

    // Format data for report
    const reportData = {
      totalFarmers: farmers.length,
      farmers: farmers.map(farmer => ({
        id: farmer._id,
        name: farmer.name,
        village: farmer.villageName,
        panchayat: farmer.panchayatName,
        mobileNo: farmer.mobileNo,
        income: farmer.income,
        estimatedIncome: farmer.estimatedIncome,
        plantsCount: farmer.plants ? farmer.plants.length : 0,
        executive: farmer.assignedExecutive ? farmer.assignedExecutive.name : 'Not Assigned',
        registeredOn: farmer.createdAt
      }))
    };

    res.status(200).json({
      success: true,
      data: reportData
    });
  } catch (error) {
    console.error('Generate farmer report error:', error);
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
const deleteFieldPhoto = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.user._id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Filter out the photo
    farmer.fieldPhotos = farmer.fieldPhotos.filter(
      photo => photo._id.toString() !== req.params.id
    );

    await farmer.save();

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

module.exports = {
  getFarmerProfile,
  updateFarmerProfile,
  uploadFieldPhotos,
  createRequest,
  getRequests,
  getCarbonCredits,
  getFieldStatus,
  getIncome,
  getNotifications,
  updateRequestStatus,
  generateFarmerReport,
  getFarmers,
  getFarmerById,
  updateFarmer,
  deleteFarmer,
  deleteFieldPhoto
};