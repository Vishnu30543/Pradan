const Admin = require('../models/Admin');
const Executive = require('../models/Executive');
const Farmer = require('../models/Farmer');
const Request = require('../models/Request');
const generateToken = require('../utils/generateToken');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

/**
 * @desc    Admin login
 * @route   POST /api/admin/login
 * @access  Public
 */
const loginAdmin = async (req, res) => {
  console.log('Admin login request:');
  try {
    console.log('Admin login request:');

    const { adminname, password } = req.body;

    // Validate input
    if (!adminname || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide adminname and password'
      });
    }

    // Check if admin exists
    // const admin = await Admin.findOne({ adminname });
    // if (!admin) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Invalid credentials'
    //   });
    // }

    // // Check if password matches
    // const isMatch = await admin.matchPassword(password);
    // if (!isMatch) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Invalid credentials'
    //   });
    // }
    // Example: server/controllers/adminController.js

    const admin = await Admin.findOne({ adminname: req.body.adminname });
    console.log('Admin found:', admin);
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(req.body.password, admin.password);
    console.log(isMatch);
    if (isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate token
    const token = generateToken(admin._id, 'admin');

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        adminname: admin.adminname
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Add new executive
 * @route   POST /api/admin/executive
 * @access  Private/Admin
 */
const addExecutive = async (req, res) => {
  try {
    const { email, password, name, phno, region } = req.body;

    // Validate input
    if (!email || !password || !name || !phno || !region) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if executive already exists
    const executiveExists = await Executive.findOne({ email });
    if (executiveExists) {
      return res.status(400).json({
        success: false,
        message: 'Executive with this email already exists'
      });
    }

    // Auto-generate employeeId
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const employeeId = `EXE-${timestamp}-${randomSuffix}`;

    // Create new executive
    const executive = await Executive.create({
      email,
      password,
      name,
      phno,
      region,
      employeeId
    });

    res.status(201).json({
      success: true,
      message: 'Executive created successfully',
      executive: {
        id: executive._id,
        name: executive.name,
        email: executive.email,
        region: executive.region,
        employeeId: executive.employeeId
      }
    });
  } catch (error) {
    console.error('Add executive error:', error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `An executive with this ${field} already exists`
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
 * @desc    Get all executives
 * @route   GET /api/admin/executives
 * @access  Private/Admin
 */
const getExecutives = async (req, res) => {
  try {
    // Get all executives with selected fields
    const executives = await Executive.find()
      .select('name email region phno assignedFarmers createdAt')
      .populate('assignedFarmers', 'name villageName');

    res.status(200).json({
      success: true,
      count: executives.length,
      executives
    });
  } catch (error) {
    console.error('Get executives error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Remove executive
 * @route   DELETE /api/admin/executive/:id
 * @access  Private/Admin
 */
const removeExecutive = async (req, res) => {
  try {
    const executive = await Executive.findById(req.params.id);

    if (!executive) {
      return res.status(404).json({
        success: false,
        message: 'Executive not found'
      });
    }

    // Check if executive has assigned farmers
    if (executive.assignedFarmers && executive.assignedFarmers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete executive with assigned farmers. Please reassign farmers first.'
      });
    }

    await executive.remove();

    res.status(200).json({
      success: true,
      message: 'Executive removed successfully'
    });
  } catch (error) {
    console.error('Remove executive error:', error);
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
    // Get all farmers with selected fields
    const farmers = await Farmer.find()
      .select('name villageName panchayatName mobileNo income estimatedIncome plants assignedExecutive createdAt')
      .populate('assignedExecutive', 'name email');

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
 * @desc    Remove farmer
 * @route   DELETE /api/admin/farmer/:id
 * @access  Private/Admin
 */
const removeFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Remove farmer from executive's assignedFarmers array
    if (farmer.assignedExecutive) {
      const executive = await Executive.findById(farmer.assignedExecutive);
      if (executive) {
        executive.assignedFarmers = executive.assignedFarmers.filter(
          id => id.toString() !== farmer._id.toString()
        );
        await executive.save();
      }
    }

    // Delete related requests
    await Request.deleteMany({ farmer: farmer._id });

    await farmer.remove();

    res.status(200).json({
      success: true,
      message: 'Farmer removed successfully'
    });
  } catch (error) {
    console.error('Remove farmer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get dashboard analytics data
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
const getAnalytics = async (req, res) => {
  try {
    // Get counts
    const [farmerCount, executiveCount] = await Promise.all([
      Farmer.countDocuments(),
      Executive.countDocuments()
    ]);

    // Get total plants count using aggregation
    const plantStats = await Farmer.aggregate([
      { $unwind: "$plants" },
      { $count: "totalPlants" }
    ]);
    const totalPlantsCount = plantStats.length > 0 ? plantStats[0].totalPlants : 0;

    // Get total and estimated income
    const incomeData = await Farmer.aggregate([
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$income' },
          totalEstimatedIncome: { $sum: '$estimatedIncome' }
        }
      }
    ]);

    const totalIncome = incomeData.length > 0 ? incomeData[0].totalIncome : 0;
    const totalEstimatedIncome = incomeData.length > 0 ? incomeData[0].totalEstimatedIncome : 0;

    // Get request statistics
    const requestStats = await Request.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format request stats
    const requestCounts = {
      pending: 0,
      'in-progress': 0,
      completed: 0,
      rejected: 0
    };

    requestStats.forEach(stat => {
      if (stat._id) {
        requestCounts[stat._id] = stat.count;
      }
    });

    res.status(200).json({
      success: true,
      analytics: {
        farmerCount,
        executiveCount,
        totalPlantsCount,
        totalIncome,
        totalEstimatedIncome,
        requestCounts,
        // Placeholder for other analytics that would be implemented in a real system
        carbonCredits: {
          total: 1250,
          monthly: 125
        },
        partnerCompanies: 8
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Generate and download PDF report
 * @route   POST /api/admin/report
 * @access  Private/Admin
 */
const generateReport = async (req, res) => {
  try {
    const { reportType } = req.body;

    if (!reportType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide report type'
      });
    }

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${Date.now()}.pdf`);

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add content to the PDF based on report type
    doc.fontSize(25).text('Agricultural Management System Report', {
      align: 'center'
    });

    doc.moveDown();
    doc.fontSize(14).text(`Report Type: ${reportType}`, {
      align: 'center'
    });

    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, {
      align: 'center'
    });

    doc.moveDown().moveDown();

    // Add different content based on report type
    if (reportType === 'farmer') {
      // Get farmer statistics
      const farmerCount = await Farmer.countDocuments();
      const farmers = await Farmer.find().select('name villageName panchayatName income estimatedIncome');

      doc.fontSize(16).text('Farmer Statistics', {
        underline: true
      });

      doc.moveDown();
      doc.fontSize(12).text(`Total Farmers: ${farmerCount}`);

      doc.moveDown();
      doc.fontSize(14).text('Farmer List', {
        underline: true
      });

      doc.moveDown();

      // Create a table-like structure for farmers
      let y = doc.y;
      doc.fontSize(10);
      doc.text('Name', 50, y);
      doc.text('Village', 200, y);
      doc.text('Panchayat', 300, y);
      doc.text('Income', 400, y);
      doc.text('Est. Income', 470, y);

      doc.moveDown();
      y = doc.y;

      // Draw a line
      doc.moveTo(50, y).lineTo(550, y).stroke();

      doc.moveDown();

      // List farmers
      farmers.forEach((farmer, index) => {
        if (index > 0 && index % 25 === 0) {
          // Add a new page after every 25 farmers
          doc.addPage();
          y = doc.y;
          doc.fontSize(10);
          doc.text('Name', 50, y);
          doc.text('Village', 200, y);
          doc.text('Panchayat', 300, y);
          doc.text('Income', 400, y);
          doc.text('Est. Income', 470, y);

          doc.moveDown();
          y = doc.y;

          // Draw a line
          doc.moveTo(50, y).lineTo(550, y).stroke();

          doc.moveDown();
        }

        y = doc.y;
        doc.text(farmer.name, 50, y);
        doc.text(farmer.villageName, 200, y);
        doc.text(farmer.panchayatName, 300, y);
        doc.text(`₹${farmer.income.toFixed(2)}`, 400, y);
        doc.text(`₹${farmer.estimatedIncome.toFixed(2)}`, 470, y);

        doc.moveDown();
      });
    } else if (reportType === 'executive') {
      // Get executive statistics
      const executiveCount = await Executive.countDocuments();
      const executives = await Executive.find().select('name email region phno');

      doc.fontSize(16).text('Executive Statistics', {
        underline: true
      });

      doc.moveDown();
      doc.fontSize(12).text(`Total Executives: ${executiveCount}`);

      doc.moveDown();
      doc.fontSize(14).text('Executive List', {
        underline: true
      });

      doc.moveDown();

      // Create a table-like structure for executives
      let y = doc.y;
      doc.fontSize(10);
      doc.text('Name', 50, y);
      doc.text('Email', 150, y);
      doc.text('Region', 300, y);
      doc.text('Phone', 400, y);

      doc.moveDown();
      y = doc.y;

      // Draw a line
      doc.moveTo(50, y).lineTo(550, y).stroke();

      doc.moveDown();

      // List executives
      executives.forEach((executive, index) => {
        if (index > 0 && index % 25 === 0) {
          // Add a new page after every 25 executives
          doc.addPage();
          y = doc.y;
          doc.fontSize(10);
          doc.text('Name', 50, y);
          doc.text('Email', 150, y);
          doc.text('Region', 300, y);
          doc.text('Phone', 400, y);

          doc.moveDown();
          y = doc.y;

          // Draw a line
          doc.moveTo(50, y).lineTo(550, y).stroke();

          doc.moveDown();
        }

        y = doc.y;
        doc.text(executive.name, 50, y);
        doc.text(executive.email, 150, y);
        doc.text(executive.region, 300, y);
        doc.text(executive.phno.toString(), 400, y);

        doc.moveDown();
      });
    } else if (reportType === 'analytics') {
      // Get analytics data
      const farmerCount = await Farmer.countDocuments();
      const executiveCount = await Executive.countDocuments();

      // Get total plants count
      const farmers = await Farmer.find().select('plants');
      let totalPlantsCount = 0;
      farmers.forEach(farmer => {
        if (farmer.plants && Array.isArray(farmer.plants)) {
          totalPlantsCount += farmer.plants.length;
        }
      });

      // Get total and estimated income
      const incomeData = await Farmer.aggregate([
        {
          $group: {
            _id: null,
            totalIncome: { $sum: '$income' },
            totalEstimatedIncome: { $sum: '$estimatedIncome' }
          }
        }
      ]);

      const totalIncome = incomeData.length > 0 ? incomeData[0].totalIncome : 0;
      const totalEstimatedIncome = incomeData.length > 0 ? incomeData[0].totalEstimatedIncome : 0;

      doc.fontSize(16).text('System Analytics', {
        underline: true
      });

      doc.moveDown();

      // Display analytics data
      doc.fontSize(12).text(`Total Farmers: ${farmerCount}`);
      doc.moveDown();
      doc.text(`Total Executives: ${executiveCount}`);
      doc.moveDown();
      doc.text(`Total Plants: ${totalPlantsCount}`);
      doc.moveDown();
      doc.text(`Total Income: ₹${totalIncome.toFixed(2)}`);
      doc.moveDown();
      doc.text(`Total Estimated Income: ₹${totalEstimatedIncome.toFixed(2)}`);
      doc.moveDown();
      doc.text(`Income Difference: ₹${(totalEstimatedIncome - totalIncome).toFixed(2)}`);

      // Add placeholder for other analytics
      doc.moveDown().moveDown();
      doc.text('Carbon Credits: 1250 units');
      doc.moveDown();
      doc.text('Partner Companies: 8');
    }

    // Finalize the PDF and end the stream
    doc.end();
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  loginAdmin,
  addExecutive,
  getExecutives,
  removeExecutive,
  getFarmers,
  removeFarmer,
  getAnalytics,
  generateReport
};