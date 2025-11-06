const Executive = require('../models/Executive');
const Farmer = require('../models/Farmer');
const Request = require('../models/Request');
const FieldStatus = require('../models/FieldStatus');
const generateToken = require('../utils/generateToken');
const smsService = require('../utils/smsService');
const upload = require('../utils/fileUpload');

/**
 * @desc    Executive login
 * @route   POST /api/executive/login
 * @access  Public
 */
const loginExecutive = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if executive exists
    const executive = await Executive.findOne({ email });
    if (!executive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await executive.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(executive._id, 'executive');

    res.status(200).json({
      success: true,
      token,
      executive: {
        id: executive._id,
        name: executive.name,
        email: executive.email,
        region: executive.region
      }
    });
  } catch (error) {
    console.error('Executive login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Add new farmer
 * @route   POST /api/executive/farmer
 * @access  Private/Executive
 */
const addFarmer = async (req, res) => {
  try {
    const { 
      name, 
      fatherOrHusbandName, 
      mobileNo, 
      email, 
      password, 
      caste, 
      isWomenFarmer, 
      villageName, 
      panchayatName, 
      groupName 
    } = req.body;

    // Validate required fields
    if (!name || !fatherOrHusbandName || !mobileNo || !password || !villageName || !panchayatName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if farmer already exists
    const farmerExists = await Farmer.findOne({ mobileNo });
    if (farmerExists) {
      return res.status(400).json({
        success: false,
        message: 'Farmer with this mobile number already exists'
      });
    }

    // Create new farmer
    const farmer = await Farmer.create({
      name,
      fatherOrHusbandName,
      mobileNo,
      email,
      password,
      caste,
      isWomenFarmer,
      villageName,
      panchayatName,
      groupName,
      assignedExecutive: req.user._id
    });

    // Add farmer to executive's assignedFarmers array
    await Executive.findByIdAndUpdate(
      req.user._id,
      { $push: { assignedFarmers: farmer._id } },
      { new: true }
    );

    // Create initial field status
    await FieldStatus.create({
      farmerID: farmer._id,
      healthStatus: 'green',
      notes: 'Initial field status'
    });

    // Send welcome SMS to farmer
    try {
      await smsService.sendSMS(
        farmer.mobileNo,
        `Welcome to Agricultural Management System, ${farmer.name}! Your account has been created successfully.`
      );
    } catch (smsError) {
      console.error('SMS sending error:', smsError);
      // Continue even if SMS fails
    }

    res.status(201).json({
      success: true,
      message: 'Farmer created successfully',
      farmer: {
        id: farmer._id,
        name: farmer.name,
        mobileNo: farmer.mobileNo,
        villageName: farmer.villageName
      }
    });
  } catch (error) {
    console.error('Add farmer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all farmers assigned to executive
 * @route   GET /api/executive/farmers
 * @access  Private/Executive
 */
const getFarmers = async (req, res) => {
  try {
    // Get executive with populated farmers
    const executive = await Executive.findById(req.user._id)
      .populate({
        path: 'assignedFarmers',
        select: 'name villageName panchayatName mobileNo income estimatedIncome plants createdAt'
      });

    if (!executive) {
      return res.status(404).json({
        success: false,
        message: 'Executive not found'
      });
    }

    res.status(200).json({
      success: true,
      count: executive.assignedFarmers.length,
      farmers: executive.assignedFarmers
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
 * @desc    Update system alerts for farmers
 * @route   PUT /api/executive/alerts
 * @access  Private/Executive
 */
const updateAlerts = async (req, res) => {
  try {
    const { alertType, message, farmerIds } = req.body;

    // Validate input
    if (!alertType || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide alert type and message'
      });
    }

    // If no specific farmers provided, get all assigned farmers
    let farmers = [];
    if (!farmerIds || farmerIds.length === 0) {
      const executive = await Executive.findById(req.user._id);
      if (!executive) {
        return res.status(404).json({
          success: false,
          message: 'Executive not found'
        });
      }
      farmers = await Farmer.find({ _id: { $in: executive.assignedFarmers } });
    } else {
      // Get specified farmers that are assigned to this executive
      farmers = await Farmer.find({
        _id: { $in: farmerIds },
        assignedExecutive: req.user._id
      });
    }

    if (farmers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No farmers found'
      });
    }

    // Update field status for weather alerts
    if (alertType === 'weather') {
      // Update field status for all farmers
      await FieldStatus.updateMany(
        { farmerID: { $in: farmers.map(f => f._id) } },
        { $set: { notes: `Weather Alert: ${message}`, lastUpdated: Date.now() } }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Alerts updated successfully',
      affectedFarmers: farmers.length
    });
  } catch (error) {
    console.error('Update alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    View requests dashboard
 * @route   GET /api/executive/dashboard
 * @access  Private/Executive
 */
const getDashboard = async (req, res) => {
  try {
    // Get executive's assigned farmers
    const executive = await Executive.findById(req.user._id);
    if (!executive) {
      return res.status(404).json({
        success: false,
        message: 'Executive not found'
      });
    }

    // Get requests from assigned farmers
    const requests = await Request.find({
      farmer: { $in: executive.assignedFarmers }
    })
      .populate('farmer', 'name villageName')
      .sort({ createdAt: -1 });

    // Count requests by status
    const requestCounts = {
      pending: 0,
      'in-progress': 0,
      completed: 0,
      rejected: 0
    };

    requests.forEach(request => {
      if (request.status in requestCounts) {
        requestCounts[request.status]++;
      }
    });

    // Get recent requests
    const recentRequests = requests.slice(0, 5);

    // Get farmer statistics
    const farmerCount = executive.assignedFarmers.length;
    
    // Get income statistics
    const incomeStats = await Farmer.aggregate([
      {
        $match: {
          _id: { $in: executive.assignedFarmers }
        }
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$income' },
          totalEstimatedIncome: { $sum: '$estimatedIncome' },
          avgIncome: { $avg: '$income' },
          avgEstimatedIncome: { $avg: '$estimatedIncome' }
        }
      }
    ]);

    const incomeData = incomeStats.length > 0 ? incomeStats[0] : {
      totalIncome: 0,
      totalEstimatedIncome: 0,
      avgIncome: 0,
      avgEstimatedIncome: 0
    };

    res.status(200).json({
      success: true,
      dashboard: {
        farmerCount,
        requestCounts,
        recentRequests,
        incomeData,
        // Recent SMS logs
        recentSMS: executive.smsLogs.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Send SMS to farmers
 * @route   POST /api/executive/sms
 * @access  Private/Executive
 */
const sendSMS = async (req, res) => {
  try {
    const { message, farmerIds } = req.body;

    // Validate input
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide message content'
      });
    }

    // If no specific farmers provided, get all assigned farmers
    let farmers = [];
    if (!farmerIds || farmerIds.length === 0) {
      const executive = await Executive.findById(req.user._id);
      if (!executive) {
        return res.status(404).json({
          success: false,
          message: 'Executive not found'
        });
      }
      farmers = await Farmer.find({ _id: { $in: executive.assignedFarmers } });
    } else {
      // Get specified farmers that are assigned to this executive
      farmers = await Farmer.find({
        _id: { $in: farmerIds },
        assignedExecutive: req.user._id
      });
    }

    if (farmers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No farmers found'
      });
    }

    // Extract phone numbers
    const phoneNumbers = farmers.map(farmer => farmer.mobileNo);

    // Send bulk SMS
    const smsResult = await smsService.sendBulkSMS(phoneNumbers, message);

    // Log SMS in executive's record
    await Executive.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          smsLogs: {
            message,
            sentTo: phoneNumbers,
            timestamp: Date.now()
          }
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'SMS sent successfully',
      smsResult
    });
  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    View carbon credit data
 * @route   GET /api/executive/carbon-credits
 * @access  Private/Executive
 */
const getCarbonCredits = async (req, res) => {
  try {
    // Get executive's assigned farmers
    const executive = await Executive.findById(req.user._id);
    if (!executive) {
      return res.status(404).json({
        success: false,
        message: 'Executive not found'
      });
    }

    // In a real system, this would calculate actual carbon credits
    // For this demo, we'll generate placeholder data
    const farmers = await Farmer.find({ _id: { $in: executive.assignedFarmers } });
    
    // Generate placeholder carbon credit data
    const carbonCredits = farmers.map(farmer => {
      // Calculate based on number of plants (simplified example)
      const plantCount = farmer.plants ? farmer.plants.length : 0;
      const creditValue = plantCount * 0.5; // Simplified calculation
      
      return {
        farmerId: farmer._id,
        farmerName: farmer.name,
        villageName: farmer.villageName,
        plantCount,
        creditValue,
        lastUpdated: new Date()
      };
    });

    // Calculate total credits
    const totalCredits = carbonCredits.reduce((total, item) => total + item.creditValue, 0);

    res.status(200).json({
      success: true,
      carbonCredits: {
        totalCredits,
        farmerCredits: carbonCredits
      }
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
 * @desc    View plant details of all assigned farmers
 * @route   GET /api/executive/plant-details
 * @access  Private/Executive
 */
const getPlantDetails = async (req, res) => {
  try {
    // Get executive's assigned farmers
    const executive = await Executive.findById(req.user._id);
    if (!executive) {
      return res.status(404).json({
        success: false,
        message: 'Executive not found'
      });
    }

    // Get farmers with plant data
    const farmers = await Farmer.find({ _id: { $in: executive.assignedFarmers } })
      .select('name villageName plants');

    // Process plant data
    const plantDetails = [];
    farmers.forEach(farmer => {
      if (farmer.plants && farmer.plants.length > 0) {
        // Count plants by type
        const plantCounts = {};
        farmer.plants.forEach(plant => {
          plantCounts[plant] = (plantCounts[plant] || 0) + 1;
        });

        // Add to details
        plantDetails.push({
          farmerId: farmer._id,
          farmerName: farmer.name,
          villageName: farmer.villageName,
          totalPlants: farmer.plants.length,
          plantCounts
        });
      }
    });

    // Calculate total plants
    const totalPlants = farmers.reduce((total, farmer) => {
      return total + (farmer.plants ? farmer.plants.length : 0);
    }, 0);

    res.status(200).json({
      success: true,
      plantData: {
        totalPlants,
        farmerCount: farmers.length,
        plantDetails
      }
    });
  } catch (error) {
    console.error('Get plant details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Upload field photos
 * @route   POST /api/executive/field-photos
 * @access  Private/Executive
 */
const uploadFieldPhotos = async (req, res) => {
  try {
    // Check if farmerId is provided
    const { farmerId } = req.body;
    if (!farmerId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide farmer ID'
      });
    }

    // Check if farmer exists and is assigned to this executive
    const farmer = await Farmer.findOne({
      _id: farmerId,
      assignedExecutive: req.user._id
    });

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found or not assigned to you'
      });
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one photo'
      });
    }

    // Process uploaded files
    const uploadedPhotos = req.files.map(file => ({
      url: `/uploads/images/${file.filename}`,
      uploadedAt: Date.now(),
      uploadedBy: 'executive'
    }));

    // Add photos to farmer's record
    farmer.fieldPhotos.push(...uploadedPhotos);
    await farmer.save();

    // Update executive's field logs
    await Executive.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          fieldLogs: `Updated field photos for ${farmer.name} on ${new Date().toLocaleString()}`
        }
      }
    );

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
 * @desc    View farmer income analysis
 * @route   GET /api/executive/income-analysis
 * @access  Private/Executive
 */
const getIncomeAnalysis = async (req, res) => {
  try {
    // Get executive's assigned farmers
    const executive = await Executive.findById(req.user._id);
    if (!executive) {
      return res.status(404).json({
        success: false,
        message: 'Executive not found'
      });
    }

    // Get farmers with income data
    const farmers = await Farmer.find({ _id: { $in: executive.assignedFarmers } })
      .select('name villageName income estimatedIncome');

    // Calculate income statistics
    const incomeAnalysis = {
      totalActualIncome: 0,
      totalEstimatedIncome: 0,
      averageActualIncome: 0,
      averageEstimatedIncome: 0,
      incomeDifference: 0,
      farmerAnalysis: []
    };

    // Process farmer data
    farmers.forEach(farmer => {
      incomeAnalysis.totalActualIncome += farmer.income;
      incomeAnalysis.totalEstimatedIncome += farmer.estimatedIncome;

      // Calculate difference and percentage
      const difference = farmer.estimatedIncome - farmer.income;
      const percentDifference = farmer.estimatedIncome > 0 
        ? (difference / farmer.estimatedIncome) * 100 
        : 0;

      incomeAnalysis.farmerAnalysis.push({
        farmerId: farmer._id,
        farmerName: farmer.name,
        villageName: farmer.villageName,
        actualIncome: farmer.income,
        estimatedIncome: farmer.estimatedIncome,
        difference,
        percentDifference: parseFloat(percentDifference.toFixed(2))
      });
    });

    // Calculate averages and overall difference
    if (farmers.length > 0) {
      incomeAnalysis.averageActualIncome = incomeAnalysis.totalActualIncome / farmers.length;
      incomeAnalysis.averageEstimatedIncome = incomeAnalysis.totalEstimatedIncome / farmers.length;
    }
    incomeAnalysis.incomeDifference = incomeAnalysis.totalEstimatedIncome - incomeAnalysis.totalActualIncome;

    // Sort farmers by income difference (largest gap first)
    incomeAnalysis.farmerAnalysis.sort((a, b) => b.difference - a.difference);

    res.status(200).json({
      success: true,
      incomeAnalysis
    });
  } catch (error) {
    console.error('Get income analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    View government schemes
 * @route   GET /api/executive/schemes
 * @access  Private/Executive
 */
const getSchemes = async (req, res) => {
  try {
    // In a real system, this would fetch from a database or external API
    // For this demo, we'll return placeholder data
    const schemes = [
      {
        id: 'scheme1',
        name: 'MGNREGA',
        fullName: 'Mahatma Gandhi National Rural Employment Guarantee Act',
        description: 'Provides at least 100 days of wage employment in a financial year to every household whose adult members volunteer to do unskilled manual work.',
        eligibility: 'Rural households seeking unskilled work',
        benefits: 'Guaranteed wage employment, unemployment allowance if work not provided within 15 days',
        applicationProcess: 'Apply through Gram Panchayat',
        documents: ['Job card', 'Aadhaar card', 'Bank account details'],
        contactInfo: 'Local Gram Panchayat office',
        website: 'https://nrega.nic.in'
      },
      {
        id: 'scheme2',
        name: 'PM-KISAN',
        fullName: 'Pradhan Mantri Kisan Samman Nidhi',
        description: 'Income support scheme for farmers to supplement their financial needs and to procure various inputs to ensure proper crop health.',
        eligibility: 'All landholding farmers with cultivable land',
        benefits: '₹6,000 per year in three equal installments',
        applicationProcess: 'Online registration through PM-KISAN portal',
        documents: ['Aadhaar card', 'Land records', 'Bank account details'],
        contactInfo: 'Local Agriculture Department',
        website: 'https://pmkisan.gov.in'
      },
      {
        id: 'scheme3',
        name: 'PMFBY',
        fullName: 'Pradhan Mantri Fasal Bima Yojana',
        description: 'Crop insurance scheme to provide financial support to farmers suffering crop loss/damage due to unforeseen events.',
        eligibility: 'All farmers growing notified crops',
        benefits: 'Insurance coverage and financial support in case of crop failure',
        applicationProcess: 'Apply through banks, insurance companies, or CSCs',
        documents: ['Land records', 'Bank account details', 'Sowing certificate'],
        contactInfo: 'Local Agriculture Department or banks',
        website: 'https://pmfby.gov.in'
      },
      {
        id: 'scheme4',
        name: 'KCC',
        fullName: 'Kisan Credit Card',
        description: 'Provides farmers with affordable credit for their agricultural operations.',
        eligibility: 'All farmers, sharecroppers, tenant farmers',
        benefits: 'Short-term credit for cultivation, post-harvest expenses, and maintenance of farm assets',
        applicationProcess: 'Apply through banks or cooperative societies',
        documents: ['Land records', 'Identity proof', 'Address proof'],
        contactInfo: 'Local banks or cooperative societies',
        website: 'https://www.nabard.org/content.aspx?id=591'
      }
    ];

    res.status(200).json({
      success: true,
      schemes
    });
  } catch (error) {
    console.error('Get schemes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  loginExecutive,
  addFarmer,
  getFarmers,
  updateAlerts,
  getDashboard,
  sendSMS,
  getCarbonCredits,
  getPlantDetails,
  uploadFieldPhotos,
  getIncomeAnalysis,
  getSchemes
};