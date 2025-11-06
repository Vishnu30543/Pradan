const Request = require('../models/Request');
const Farmer = require('../models/Farmer');
const Executive = require('../models/Executive');

/**
 * @desc    Get all requests for a farmer
 * @route   GET /api/farmer/requests
 * @access  Private/Farmer
 */
exports.getFarmerRequests = async (req, res) => {
  try {
    const requests = await Request.find({ farmer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('assignedExecutive', 'name email phone');

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Get farmer requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Assign request to executive
 * @route   PUT /api/admin/requests/:id/assign
 * @access  Private/Admin
 */
exports.assignRequest = async (req, res) => {
  try {
    const { executiveId } = req.body;

    if (!executiveId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide executive ID'
      });
    }

    // Check if executive exists
    const executive = await Executive.findById(executiveId);
    if (!executive) {
      return res.status(404).json({
        success: false,
        message: 'Executive not found'
      });
    }

    // Find and update request
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    request.assignedExecutive = executiveId;
    request.status = 'assigned';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request assigned successfully',
      request
    });
  } catch (error) {
    console.error('Assign request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all requests for admin
 * @route   GET /api/admin/requests
 * @access  Private/Admin
 */
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .sort({ createdAt: -1 })
      .populate('farmer', 'name villageName panchayatName mobileNo')
      .populate('assignedExecutive', 'name email phone');

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Create a new request
 * @route   POST /api/farmer/requests
 * @access  Private/Farmer
 */
exports.createRequest = async (req, res) => {
  try {
    const { title, description, requestType, urgency } = req.body;

    // Create request
    const request = await Request.create({
      farmer: req.user._id,
      title,
      description,
      requestType,
      urgency,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      request
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
 * @desc    Get request by ID
 * @route   GET /api/farmer/requests/:id
 * @access  Private/Farmer or Executive
 */
exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('farmer', 'name email phone')
      .populate('assignedExecutive', 'name email phone');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is authorized to view this request
    if (
      req.user.role === 'farmer' && 
      request.farmer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    if (
      req.user.role === 'executive' && 
      request.assignedExecutive && 
      request.assignedExecutive._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    res.status(200).json({
      success: true,
      request
    });
  } catch (error) {
    console.error('Get request by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update request
 * @route   PUT /api/farmer/requests/:id
 * @access  Private/Farmer
 */
exports.updateRequest = async (req, res) => {
  try {
    const { title, description, requestType, urgency } = req.body;

    let request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if farmer owns this request
    if (request.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    // Check if request is already resolved
    if (request.status === 'resolved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a resolved request'
      });
    }

    // Update request
    request = await Request.findByIdAndUpdate(
      req.params.id,
      { title, description, requestType, urgency },
      { new: true, runValidators: true }
    ).populate('assignedExecutive', 'name email phone');

    res.status(200).json({
      success: true,
      request
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Add comment to request
 * @route   POST /api/farmer/requests/:id/comment
 * @access  Private/Farmer or Executive
 */
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide comment text'
      });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is authorized to comment on this request
    if (
      req.user.role === 'farmer' && 
      request.farmer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to comment on this request'
      });
    }

    if (
      req.user.role === 'executive' && 
      request.assignedExecutive && 
      request.assignedExecutive.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to comment on this request'
      });
    }

    // Add comment
    await request.addComment(
      text,
      req.user.role,
      req.user._id,
      req.user.name
    );

    const updatedRequest = await Request.findById(req.params.id)
      .populate('farmer', 'name email phone')
      .populate('assignedExecutive', 'name email phone');

    res.status(200).json({
      success: true,
      request: updatedRequest
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all requests assigned to an executive
 * @route   GET /api/executive/requests
 * @access  Private/Executive
 */
exports.getExecutiveRequests = async (req, res) => {
  try {
    const requests = await Request.find({ assignedExecutive: req.user._id })
      .sort({ createdAt: -1 })
      .populate('farmer', 'name email phone');

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Get executive requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update request status
 * @route   PUT /api/executive/requests/:id/status
 * @access  Private/Executive
 */
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status'
      });
    }

    let request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if executive is assigned to this request
    if (
      request.assignedExecutive && 
      request.assignedExecutive.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    // Update status
    const resolvedDate = status === 'resolved' ? Date.now() : null;
    await request.updateStatus(status, resolvedDate);

    // Get updated request
    request = await Request.findById(req.params.id)
      .populate('farmer', 'name email phone')
      .populate('assignedExecutive', 'name email phone');

    res.status(200).json({
      success: true,
      request
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
 * @desc    Get request statistics
 * @route   GET /api/admin/requests/stats
 * @access  Private/Admin
 */
exports.getRequestStats = async (req, res) => {
  try {
    const { executiveId } = req.query;
    
    const stats = await Request.getRequestStats(executiveId);
    
    // Format stats for frontend
    const formattedStats = {
      pending: 0,
      'in-progress': 0,
      resolved: 0
    };
    
    stats.forEach(stat => {
      formattedStats[stat.status] = stat.count;
    });
    
    res.status(200).json({
      success: true,
      stats: formattedStats
    });
  } catch (error) {
    console.error('Get request stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Assign request to executive
 * @route   PUT /api/admin/requests/:id/assign
 * @access  Private/Admin
 */
exports.assignRequestToExecutive = async (req, res) => {
  try {
    const { executiveId } = req.body;
    
    if (!executiveId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide executive ID'
      });
    }
    
    // Check if executive exists
    const executive = await Executive.findById(executiveId);
    if (!executive) {
      return res.status(404).json({
        success: false,
        message: 'Executive not found'
      });
    }
    
    let request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }
    
    // Assign executive
    request = await Request.findByIdAndUpdate(
      req.params.id,
      { assignedExecutive: executiveId },
      { new: true, runValidators: true }
    )
      .populate('farmer', 'name email phone')
      .populate('assignedExecutive', 'name email phone');
    
    res.status(200).json({
      success: true,
      request
    });
  } catch (error) {
    console.error('Assign request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get assigned farmers for an executive
 * @route   GET /api/executive/farmers
 * @access  Private/Executive
 */
exports.getAssignedFarmers = async (req, res) => {
  try {
    // Find all requests assigned to this executive
    const requests = await Request.find({ assignedExecutive: req.user._id })
      .distinct('farmer');
    
    // Get farmer details
    const farmers = await Farmer.find({ _id: { $in: requests } })
      .select('name email phone villageName panchayatName');
    
    res.status(200).json({
      success: true,
      count: farmers.length,
      farmers
    });
  } catch (error) {
    console.error('Get assigned farmers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get farmer details by ID
 * @route   GET /api/executive/farmers/:id
 * @access  Private/Executive
 */
exports.getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id)
      .select('-password');
    
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }
    
    // Check if executive is assigned to this farmer
    const hasAssignment = await Request.exists({
      farmer: farmer._id,
      assignedExecutive: req.user._id
    });
    
    if (!hasAssignment) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this farmer'
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
 * @desc    Get request analytics for executive
 * @route   GET /api/executive/analytics/requests
 * @access  Private/Executive
 */
exports.getRequestAnalytics = async (req, res) => {
  try {
    // Get request counts by status
    const statusCounts = await Request.aggregate([
      { $match: { assignedExecutive: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get request counts by type
    const typeCounts = await Request.aggregate([
      { $match: { assignedExecutive: req.user._id } },
      { $group: { _id: '$requestType', count: { $sum: 1 } } }
    ]);
    
    // Format data for frontend
    const statusData = {};
    statusCounts.forEach(item => {
      statusData[item._id] = item.count;
    });
    
    const typeData = {};
    typeCounts.forEach(item => {
      typeData[item._id] = item.count;
    });
    
    res.status(200).json({
      success: true,
      analytics: {
        byStatus: statusData,
        byType: typeData
      }
    });
  } catch (error) {
    console.error('Get request analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get farmer analytics for executive
 * @route   GET /api/executive/analytics/farmers
 * @access  Private/Executive
 */
exports.getFarmerAnalytics = async (req, res) => {
  try {
    // Get unique farmer count
    const farmerCount = await Request.find({ assignedExecutive: req.user._id })
      .distinct('farmer')
      .then(farmers => farmers.length);
    
    // Get farmers with most requests
    const topFarmers = await Request.aggregate([
      { $match: { assignedExecutive: req.user._id } },
      { $group: { _id: '$farmer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Get farmer IDs
    const farmerIds = topFarmers.map(item => item._id);
    
    // Get farmer details
    const farmerDetails = await Farmer.find({ _id: { $in: farmerIds } })
      .select('name villageName');
    
    // Map farmer details to counts
    const formattedTopFarmers = topFarmers.map(item => {
      const farmer = farmerDetails.find(f => f._id.toString() === item._id.toString());
      return {
        farmerId: item._id,
        name: farmer ? farmer.name : 'Unknown',
        village: farmer ? farmer.villageName : 'Unknown',
        requestCount: item.count
      };
    });
    
    res.status(200).json({
      success: true,
      analytics: {
        totalFarmers: farmerCount,
        topFarmers: formattedTopFarmers
      }
    });
  } catch (error) {
    console.error('Get farmer analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Send SMS to farmer
 * @route   POST /api/executive/send-sms
 * @access  Private/Executive
 */
exports.sendSMS = async (req, res) => {
  try {
    const { farmerId, message } = req.body;
    
    if (!farmerId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide farmer ID and message'
      });
    }
    
    // Check if farmer exists
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }
    
    // Check if executive is assigned to this farmer
    const hasAssignment = await Request.exists({
      farmer: farmerId,
      assignedExecutive: req.user._id
    });
    
    if (!hasAssignment) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send SMS to this farmer'
      });
    }
    
    // In a real app, this would integrate with an SMS service
    // For demo purposes, we'll just log the message
    console.log(`SMS to ${farmer.name} (${farmer.phone}): ${message}`);
    
    res.status(200).json({
      success: true,
      message: 'SMS sent successfully'
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
 * @desc    Send notification to farmer
 * @route   POST /api/executive/send-notification
 * @access  Private/Executive
 */
exports.sendNotification = async (req, res) => {
  try {
    const { farmerId, title, message } = req.body;
    
    if (!farmerId || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide farmer ID, title, and message'
      });
    }
    
    // Check if farmer exists
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }
    
    // Check if executive is assigned to this farmer
    const hasAssignment = await Request.exists({
      farmer: farmerId,
      assignedExecutive: req.user._id
    });
    
    if (!hasAssignment) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send notifications to this farmer'
      });
    }
    
    // In a real app, this would integrate with a notification service
    // For demo purposes, we'll just add to the farmer's notifications array
    farmer.notifications.push({
      title,
      message,
      from: req.user._id,
      createdAt: Date.now()
    });
    
    await farmer.save();
    
    res.status(200).json({
      success: true,
      message: 'Notification sent successfully'
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get field visits for executive
 * @route   GET /api/executive/field-visits
 * @access  Private/Executive
 */
exports.getFieldVisits = async (req, res) => {
  try {
    // In a real app, this would fetch from a FieldVisit model
    // For demo purposes, we'll return mock data
    const fieldVisits = [
      {
        id: '1',
        farmerId: 'farmer123',
        farmerName: 'Rajesh Kumar',
        location: 'Nagpur, Maharashtra',
        scheduledDate: new Date(Date.now() + 86400000), // Tomorrow
        status: 'scheduled',
        purpose: 'Crop inspection'
      },
      {
        id: '2',
        farmerId: 'farmer456',
        farmerName: 'Suresh Patel',
        location: 'Amravati, Maharashtra',
        scheduledDate: new Date(Date.now() + 172800000), // Day after tomorrow
        status: 'scheduled',
        purpose: 'Soil testing'
      },
      {
        id: '3',
        farmerId: 'farmer789',
        farmerName: 'Amit Singh',
        location: 'Wardha, Maharashtra',
        scheduledDate: new Date(Date.now() - 86400000), // Yesterday
        status: 'completed',
        purpose: 'Pest control assessment',
        notes: 'Recommended organic pesticides for aphid infestation'
      }
    ];
    
    res.status(200).json({
      success: true,
      count: fieldVisits.length,
      fieldVisits
    });
  } catch (error) {
    console.error('Get field visits error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Schedule a field visit
 * @route   POST /api/executive/field-visits
 * @access  Private/Executive
 */
exports.scheduleFieldVisit = async (req, res) => {
  try {
    const { farmerId, scheduledDate, purpose } = req.body;
    
    if (!farmerId || !scheduledDate || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Please provide farmer ID, scheduled date, and purpose'
      });
    }
    
    // Check if farmer exists
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }
    
    // Check if executive is assigned to this farmer
    const hasAssignment = await Request.exists({
      farmer: farmerId,
      assignedExecutive: req.user._id
    });
    
    if (!hasAssignment) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to schedule visits for this farmer'
      });
    }
    
    // In a real app, this would create a FieldVisit record
    // For demo purposes, we'll just return a success response
    res.status(201).json({
      success: true,
      message: 'Field visit scheduled successfully',
      fieldVisit: {
        id: Math.random().toString(36).substring(7),
        farmerId,
        farmerName: farmer.name,
        location: farmer.villageName,
        scheduledDate,
        status: 'scheduled',
        purpose
      }
    });
  } catch (error) {
    console.error('Schedule field visit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update a field visit
 * @route   PUT /api/executive/field-visits/:id
 * @access  Private/Executive
 */
exports.updateFieldVisit = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }
    
    // In a real app, this would update a FieldVisit record
    // For demo purposes, we'll just return a success response
    res.status(200).json({
      success: true,
      message: 'Field visit updated successfully',
      fieldVisit: {
        id: req.params.id,
        status,
        notes: notes || '',
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Update field visit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};