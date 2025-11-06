const mongoose = require('mongoose');
const GovernmentScheme = require('../models/GovernmentScheme');
const SchemeApplication = require('../models/SchemeApplication');
const Farmer = require('../models/Farmer');
const User = require('../models/User');

/**
 * Get all government schemes (with filtering options)
 * @route GET /api/admin/schemes
 * @access Private (Admin)
 */
exports.getAllSchemes = async (req, res) => {
  try {
    const { 
      status, 
      category, 
      relevance, 
      search,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (relevance) query.relevance = relevance;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const schemes = await GovernmentScheme.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email');

    // Get total count for pagination
    const total = await GovernmentScheme.countDocuments(query);

    res.status(200).json({
      success: true,
      count: schemes.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      },
      data: schemes
    });
  } catch (error) {
    console.error('Error in getAllSchemes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get a single government scheme by ID
 * @route GET /api/admin/schemes/:id
 * @access Private (Admin)
 */
exports.getSchemeById = async (req, res) => {
  try {
    const scheme = await GovernmentScheme.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    res.status(200).json({
      success: true,
      data: scheme
    });
  } catch (error) {
    console.error('Error in getSchemeById:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Create a new government scheme
 * @route POST /api/admin/schemes
 * @access Private (Admin)
 */
exports.createScheme = async (req, res) => {
  try {
    // Add the admin user as creator
    req.body.createdBy = req.user.id;

    const scheme = await GovernmentScheme.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Scheme created successfully',
      data: scheme
    });
  } catch (error) {
    console.error('Error in createScheme:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Update a government scheme
 * @route PUT /api/admin/schemes/:id
 * @access Private (Admin)
 */
exports.updateScheme = async (req, res) => {
  try {
    let scheme = await GovernmentScheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    // Update the scheme
    scheme = await GovernmentScheme.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Scheme updated successfully',
      data: scheme
    });
  } catch (error) {
    console.error('Error in updateScheme:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Delete a government scheme
 * @route DELETE /api/admin/schemes/:id
 * @access Private (Admin)
 */
exports.deleteScheme = async (req, res) => {
  try {
    const scheme = await GovernmentScheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    // Check if there are any applications for this scheme
    const applications = await SchemeApplication.countDocuments({ scheme: req.params.id });
    
    if (applications > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete scheme with existing applications. Consider marking it as inactive instead.'
      });
    }

    await scheme.remove();

    res.status(200).json({
      success: true,
      message: 'Scheme deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteScheme:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get scheme applications with filtering options
 * @route GET /api/admin/scheme-applications
 * @access Private (Admin)
 */
exports.getSchemeApplications = async (req, res) => {
  try {
    const { 
      status, 
      schemeId,
      farmerId,
      search,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (status) query.status = status;
    if (schemeId) query.scheme = schemeId;
    if (farmerId) query.farmer = farmerId;
    
    // If executive is requesting, only show applications assigned to them
    if (req.user.role === 'executive') {
      query.reviewedBy = req.user.id;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const applications = await SchemeApplication.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('farmer', 'name mobileNo email')
      .populate('scheme', 'title category')
      .populate('reviewedBy', 'name email');

    // Get total count for pagination
    const total = await SchemeApplication.countDocuments(query);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      },
      data: applications
    });
  } catch (error) {
    console.error('Error in getSchemeApplications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get a single scheme application by ID
 * @route GET /api/admin/scheme-applications/:id
 * @access Private (Admin, Executive)
 */
exports.getApplicationById = async (req, res) => {
  try {
    const application = await SchemeApplication.findById(req.params.id)
      .populate('farmer', 'name mobileNo email address farmDetails')
      .populate('scheme', 'title description category eligibility benefits documents')
      .populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // If executive is requesting, check if they are assigned to this application
    if (req.user.role === 'executive' && 
        application.reviewedBy && 
        application.reviewedBy._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this application'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error in getApplicationById:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Update a scheme application status
 * @route PUT /api/admin/scheme-applications/:id/status
 * @access Private (Admin, Executive)
 */
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const application = await SchemeApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // If executive is updating, check if they are assigned to this application
    if (req.user.role === 'executive' && 
        application.reviewedBy && 
        application.reviewedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update status and add to history
    await application.updateStatus(status, remarks, req.user.id);

    // If status is being updated to 'approved' or 'rejected', set reviewedBy and reviewDate
    if (['approved', 'rejected'].includes(status) && !application.reviewedBy) {
      application.reviewedBy = req.user.id;
      application.reviewDate = Date.now();
      await application.save();
    }

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: application
    });
  } catch (error) {
    console.error('Error in updateApplicationStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Assign an application to an executive for review
 * @route PUT /api/admin/scheme-applications/:id/assign
 * @access Private (Admin)
 */
exports.assignApplicationToExecutive = async (req, res) => {
  try {
    const { executiveId } = req.body;
    
    if (!executiveId) {
      return res.status(400).json({
        success: false,
        message: 'Executive ID is required'
      });
    }

    // Verify executive exists and has executive role
    const executive = await User.findOne({ _id: executiveId, role: 'executive' });
    
    if (!executive) {
      return res.status(404).json({
        success: false,
        message: 'Executive not found'
      });
    }

    const application = await SchemeApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Assign executive and update history
    application.reviewedBy = executiveId;
    application.history.push({
      status: application.status,
      remarks: `Assigned to executive for review`,
      updatedBy: req.user.id,
      updatedAt: Date.now()
    });

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application assigned to executive successfully',
      data: application
    });
  } catch (error) {
    console.error('Error in assignApplicationToExecutive:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Verify documents in a scheme application
 * @route PUT /api/admin/scheme-applications/:id/verify-documents
 * @access Private (Admin, Executive)
 */
exports.verifyApplicationDocuments = async (req, res) => {
  try {
    const { documentIds, verified } = req.body;
    
    if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Document IDs array is required'
      });
    }

    const application = await SchemeApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // If executive is updating, check if they are assigned to this application
    if (req.user.role === 'executive' && 
        application.reviewedBy && 
        application.reviewedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update document verification status
    documentIds.forEach(docId => {
      const document = application.documents.id(docId);
      if (document) {
        document.verified = verified;
      }
    });

    // Add to history
    application.history.push({
      status: application.status,
      remarks: `Documents ${verified ? 'verified' : 'marked as unverified'}`,
      updatedBy: req.user.id,
      updatedAt: Date.now()
    });

    await application.save();

    res.status(200).json({
      success: true,
      message: `Documents ${verified ? 'verified' : 'marked as unverified'} successfully`,
      data: application
    });
  } catch (error) {
    console.error('Error in verifyApplicationDocuments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get scheme application statistics
 * @route GET /api/admin/scheme-applications/stats
 * @access Private (Admin)
 */
exports.getApplicationStats = async (req, res) => {
  try {
    const { schemeId, period } = req.query;
    
    // Build match stage for aggregation
    const matchStage = {};
    
    if (schemeId) {
      matchStage.scheme = mongoose.Types.ObjectId(schemeId);
    }
    
    // Add date filtering based on period
    if (period) {
      const now = new Date();
      let startDate;
      
      switch (period) {
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'quarter':
          startDate = new Date(now.setMonth(now.getMonth() - 3));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        matchStage.createdAt = { $gte: startDate };
      }
    }
    
    // Get status counts
    const statusStats = await SchemeApplication.getApplicationStats(matchStage);
    
    // Get scheme-wise application counts
    const schemeStats = await SchemeApplication.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$scheme',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'governmentschemes',
          localField: '_id',
          foreignField: '_id',
          as: 'schemeDetails'
        }
      },
      {
        $project: {
          scheme: { $arrayElemAt: ['$schemeDetails.title', 0] },
          count: 1,
          _id: 0
        }
      }
    ]);
    
    // Get trend data (applications over time)
    const trendData = await SchemeApplication.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } },
      {
        $project: {
          date: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        statusStats,
        schemeStats,
        trendData
      }
    });
  } catch (error) {
    console.error('Error in getApplicationStats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};