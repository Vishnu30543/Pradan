/**
 * Analytics Controller
 * Provides analytics data for the admin dashboard
 */

const Farmer = require('../models/Farmer');
const Executive = require('../models/Executive');
const Request = require('../models/Request');
const SchemeApplication = require('../models/SchemeApplication');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/analytics/dashboard
 * @access  Private/Admin
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Run all independent queries in parallel
    const [
      farmerCount,
      executiveCount,
      plantStats,
      incomeData,
      requestStats
    ] = await Promise.all([
      // 1. Farmer count
      Farmer.countDocuments(),

      // 2. Executive count
      Executive.countDocuments(),

      // 3. Total plants count via aggregation
      Farmer.aggregate([
        { $unwind: "$plants" },
        { $count: "totalPlants" }
      ]),

      // 4. Income data
      Farmer.aggregate([
        {
          $group: {
            _id: null,
            totalIncome: { $sum: '$income' },
            totalEstimatedIncome: { $sum: '$estimatedIncome' }
          }
        }
      ]),

      // 5. Request stats
      Request.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const totalPlantsCount = plantStats.length > 0 ? plantStats[0].totalPlants : 0;
    const totalIncome = incomeData.length > 0 ? incomeData[0].totalIncome : 0;
    const totalEstimatedIncome = incomeData.length > 0 ? incomeData[0].totalEstimatedIncome : 0;

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
      data: {
        farmerCount,
        executiveCount,
        plantCount: totalPlantsCount,
        totalRevenue: totalIncome,
        totalEstimatedIncome,
        requestCounts,
        // Mock chart data to satisfy frontend
        incomeData: {
          estimated: [120000, 150000, 180000, 210000, 240000, 270000],
          actual: [110000, 145000, 175000, 200000, 235000, 260000],
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        },
        regionData: {
          labels: ['North', 'South', 'East', 'West', 'Central'],
          data: [85, 45, 65, 30, 20]
        },
        carbonCredits: 1250,
        partnerCompanies: 8
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get revenue analytics
 * @route   GET /api/admin/analytics/revenue
 * @access  Private/Admin
 */
exports.getRevenueAnalytics = async (req, res) => {
  try {
    // Get monthly income data (mock data for demo)
    const monthlyRevenue = [
      { month: 'Jan', income: 12500, estimatedIncome: 15000 },
      { month: 'Feb', income: 13200, estimatedIncome: 16000 },
      { month: 'Mar', income: 14800, estimatedIncome: 17500 },
      { month: 'Apr', income: 15300, estimatedIncome: 18000 },
      { month: 'May', income: 16700, estimatedIncome: 19500 },
      { month: 'Jun', income: 18200, estimatedIncome: 21000 }
    ];

    res.status(200).json({
      success: true,
      data: {
        monthlyRevenue,
        totalRevenue: 90700,
        totalEstimatedRevenue: 107000,
        growthRate: 8.5
      }
    });
  } catch (error) {
    console.error('Get revenue analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get farmer analytics
 * @route   GET /api/admin/analytics/farmers
 * @access  Private/Admin
 */
exports.getFarmerAnalytics = async (req, res) => {
  try {
    // Get farmer distribution by region
    const regionDistribution = await Farmer.aggregate([
      {
        $group: {
          _id: '$villageName',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get farmer distribution by crop type (mock data for demo)
    const cropDistribution = [
      { crop: 'Rice', count: 45 },
      { crop: 'Wheat', count: 38 },
      { crop: 'Sugarcane', count: 27 },
      { crop: 'Cotton', count: 22 },
      { crop: 'Pulses', count: 18 }
    ];

    res.status(200).json({
      success: true,
      data: {
        regionDistribution: regionDistribution.map(item => ({
          region: item._id,
          count: item.count
        })),
        cropDistribution,
        newFarmersThisMonth: 12,
        activeFarmers: 120
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
 * @desc    Get executive analytics
 * @route   GET /api/admin/analytics/executives
 * @access  Private/Admin
 */
exports.getExecutiveAnalytics = async (req, res) => {
  try {
    // Get executives with farmer counts
    const executiveData = await Executive.aggregate([
      {
        $project: {
          name: 1,
          region: 1,
          farmerCount: { $size: { $ifNull: ['$assignedFarmers', []] } }
        }
      },
      { $sort: { farmerCount: -1 } }
    ]);

    // Get executive performance (mock data for demo)
    const executivePerformance = executiveData.slice(0, 5).map(exec => ({
      name: exec.name,
      region: exec.region,
      farmerCount: exec.farmerCount,
      requestsResolved: Math.floor(Math.random() * 50) + 10,
      avgResponseTime: Math.floor(Math.random() * 24) + 1 + ' hours'
    }));

    res.status(200).json({
      success: true,
      data: {
        executivePerformance,
        totalExecutives: await Executive.countDocuments(),
        activeExecutives: await Executive.countDocuments({ lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
      }
    });
  } catch (error) {
    console.error('Get executive analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get request analytics
 * @route   GET /api/admin/analytics/requests
 * @access  Private/Admin
 */
exports.getRequestAnalytics = async (req, res) => {
  try {
    // Get request statistics by status
    const requestStats = await Request.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format request stats
    const requestByStatus = {
      pending: 0,
      'in-progress': 0,
      completed: 0,
      rejected: 0
    };

    requestStats.forEach(stat => {
      if (stat._id in requestByStatus) {
        requestByStatus[stat._id] = stat.count;
      }
    });

    // Get request statistics by type (mock data for demo)
    const requestByType = [
      { type: 'Technical Support', count: 35 },
      { type: 'Financial Assistance', count: 28 },
      { type: 'Crop Disease', count: 22 },
      { type: 'Equipment', count: 15 },
      { type: 'Other', count: 10 }
    ];

    // Get monthly request trends (mock data for demo)
    const monthlyTrends = [
      { month: 'Jan', requests: 25 },
      { month: 'Feb', requests: 32 },
      { month: 'Mar', requests: 28 },
      { month: 'Apr', requests: 35 },
      { month: 'May', requests: 42 },
      { month: 'Jun', requests: 38 }
    ];

    res.status(200).json({
      success: true,
      data: {
        requestByStatus,
        requestByType,
        monthlyTrends,
        avgResolutionTime: '36 hours',
        satisfactionRate: '85%'
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
 * @desc    Get carbon credit analytics
 * @route   GET /api/admin/analytics/carbon-credits
 * @access  Private/Admin
 */
exports.getCarbonCreditAnalytics = async (req, res) => {
  try {
    // Mock data for carbon credits (would be real data in production)
    const monthlyCredits = [
      { month: 'Jan', credits: 180 },
      { month: 'Feb', credits: 210 },
      { month: 'Mar', credits: 195 },
      { month: 'Apr', credits: 225 },
      { month: 'May', credits: 240 },
      { month: 'Jun', credits: 260 }
    ];

    const creditsByRegion = [
      { region: 'North', credits: 450 },
      { region: 'South', credits: 380 },
      { region: 'East', credits: 320 },
      { region: 'West', credits: 290 },
      { region: 'Central', credits: 210 }
    ];

    res.status(200).json({
      success: true,
      data: {
        totalCredits: 1650,
        monthlyCredits,
        creditsByRegion,
        carbonFootprintReduction: '28%',
        projectedAnnualCredits: 3200
      }
    });
  } catch (error) {
    console.error('Get carbon credit analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};