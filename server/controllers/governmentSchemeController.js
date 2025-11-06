const mongoose = require('mongoose');
const Farmer = require('../models/Farmer');
const GovernmentScheme = require('../models/GovernmentScheme');
const SchemeApplication = require('../models/SchemeApplication');

/**
 * Get all government schemes
 * @route GET /api/farmer/government-schemes
 * @access Private (Farmer)
 */
exports.getGovernmentSchemes = async (req, res) => {
  try {
    // In a real application, this would fetch from the database
    // const schemes = await GovernmentScheme.find({ status: 'active' });
    
    // For demo purposes, we'll return mock data
    const schemes = [
      {
        _id: '1',
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        description:
          'A crop insurance scheme that provides financial support to farmers in case of crop failure due to natural calamities, pests, and diseases.',
        category: 'insurance',
        eligibility: [
          'All farmers including sharecroppers and tenant farmers growing notified crops',
          'Both loanee and non-loanee farmers are eligible',
          'Voluntary for non-loanee farmers',
        ],
        benefits: [
          'Comprehensive risk coverage for pre-sowing to post-harvest losses',
          'Low premium rates: 2% for Kharif, 1.5% for Rabi, and 5% for annual commercial/horticultural crops',
          'Use of technology for quick assessment and settlement of claims',
        ],
        applicationProcess: [
          'Loanee farmers are automatically covered through banks',
          'Non-loanee farmers can apply through insurance companies, CSCs, or banks',
          'Submit application form along with premium and necessary documents',
        ],
        documents: [
          'Land records (7/12 extract, Khasra, etc.)',
          'Identity proof (Aadhaar card)',
          'Bank account details',
          'Passport size photograph',
          'Sowing certificate (if applicable)',
        ],
        lastDateToApply: '2023-07-31T00:00:00.000Z',
        contactDetails: {
          phone: '1800-180-1551',
          email: 'pmfby-agri@gov.in',
          website: 'https://pmfby.gov.in',
        },
        status: 'active',
        relevance: 'high',
        additionalInfo:
          'Premium rates are subsidized by the government. Claims are processed through a centralized system.',
      },
      {
        _id: '2',
        title: 'PM Kisan Samman Nidhi Yojana',
        description:
          'A central sector scheme to provide income support to all landholding farmers\'s families in the country to supplement their financial needs.',
        category: 'financial-assistance',
        eligibility: [
          'All landholding farmers\' families with cultivable land',
          'Small and marginal farmers',
          'Subject to exclusion criteria based on income tax payment, professional positions, etc.',
        ],
        benefits: [
          'Direct income support of Rs. 6,000 per year to eligible farmer families',
          'Amount transferred in three equal installments of Rs. 2,000 each',
          'Direct transfer to bank accounts to eliminate middlemen',
        ],
        applicationProcess: [
          'Register through the local revenue officer/patwari',
          'Fill the application form with personal and bank details',
          'Verification by State/UT governments',
          'Online registration also available on PM-KISAN portal',
        ],
        documents: [
          'Aadhaar Card',
          'Land records',
          'Bank account details with IFSC code',
          'Mobile number',
        ],
        lastDateToApply: null, // Ongoing scheme
        contactDetails: {
          phone: '011-23381092',
          email: 'pmkisan-ict@gov.in',
          website: 'https://pmkisan.gov.in',
        },
        status: 'active',
        relevance: 'high',
        additionalInfo:
          'The scheme was launched in February 2019 and has benefited over 10 crore farmers nationwide.',
      },
      {
        _id: '3',
        title: 'Kisan Credit Card (KCC) Scheme',
        description:
          'Provides farmers with affordable credit for their agricultural needs and other requirements.',
        category: 'credit',
        eligibility: [
          'All farmers - individual/joint borrowers',
          'Tenant farmers, oral lessees, and sharecroppers',
          'SHGs or Joint Liability Groups of farmers',
        ],
        benefits: [
          'Simplified procedure for availing loans',
          'Flexible repayment options aligned with harvest cycles',
          'Interest subvention of 2% for prompt repayment',
          'Coverage under Personal Accident Insurance Scheme (PAIS)',
        ],
        applicationProcess: [
          'Apply at nearest bank branch or through online banking',
          'Submit application form with required documents',
          'Bank officials verify the documents and land details',
          'Card issued after approval',
        ],
        documents: [
          'Identity proof (Aadhaar/Voter ID)',
          'Address proof',
          'Land ownership documents',
          'Passport size photographs',
          'Details of crops grown',
        ],
        lastDateToApply: null, // Ongoing scheme
        contactDetails: {
          phone: '1800-180-1111',
          email: 'help@nabard.org',
          website: 'https://www.nabard.org',
        },
        status: 'active',
        relevance: 'high',
        additionalInfo:
          'KCC has a validity of 5 years and provides a revolving cash credit facility.',
      },
      {
        _id: '4',
        title: 'Soil Health Card Scheme',
        description:
          'Provides information on soil health to farmers to help them improve productivity through judicious use of inputs.',
        category: 'technical-assistance',
        eligibility: ['All farmers with agricultural land'],
        benefits: [
          'Soil health assessment every 2 years',
          'Crop-wise recommendations for fertilizers and nutrients',
          'Improved soil health and increased productivity',
          'Reduced cultivation cost through optimized use of fertilizers',
        ],
        applicationProcess: [
          'Contact local agriculture department or Krishi Vigyan Kendra',
          'Submit request for soil testing',
          'Soil samples collected by officials or can be submitted by farmers',
          'Receive Soil Health Card after testing',
        ],
        documents: [
          'Land records',
          'Identity proof',
          'Contact details',
        ],
        lastDateToApply: null, // Ongoing scheme
        contactDetails: {
          phone: '1800-180-1551',
          email: 'soilhealth@gov.in',
          website: 'https://soilhealth.dac.gov.in',
        },
        status: 'active',
        relevance: 'medium',
        additionalInfo:
          'The scheme was launched in February 2015 and aims to cover all 14 crore farm holdings in the country.',
      },
      {
        _id: '5',
        title: 'PM Krishi Sinchai Yojana (PMKSY)',
        description:
          'Aims to ensure access to irrigation to all agricultural farms to produce \'per drop more crop\' and improve water use efficiency.',
        category: 'infrastructure',
        eligibility: [
          'Individual farmers',
          'Group of farmers',
          'Farmers\'s cooperatives',
        ],
        benefits: [
          'Subsidies for micro-irrigation systems (drip and sprinkler)',
          'Development of irrigation sources',
          'Improved water use efficiency',
          'Enhanced crop productivity',
        ],
        applicationProcess: [
          'Apply through local agriculture department',
          'Submit application with required documents',
          'Site verification by officials',
          'Approval and implementation',
        ],
        documents: [
          'Land ownership documents',
          'Bank account details',
          'Identity proof',
          'Photographs of the proposed site',
          'Detailed project report (for large projects)',
        ],
        lastDateToApply: '2023-09-30T00:00:00.000Z',
        contactDetails: {
          phone: '011-23383744',
          email: 'pmksy-mowr@gov.in',
          website: 'https://pmksy.gov.in',
        },
        status: 'active',
        relevance: 'high',
        additionalInfo:
          'The scheme has four components: Accelerated Irrigation Benefit Programme (AIBP), Har Khet Ko Pani, Per Drop More Crop, and Watershed Development.',
      },
      {
        _id: '6',
        title: 'National Mission for Sustainable Agriculture (NMSA)',
        description:
          'Promotes sustainable agriculture through integrated farming, appropriate soil health management, and resource conservation technologies.',
        category: 'sustainable-farming',
        eligibility: [
          'All farmers',
          'Special focus on small and marginal farmers',
        ],
        benefits: [
          'Financial assistance for adopting sustainable agricultural practices',
          'Support for organic farming',
          'Assistance for water conservation and management',
          'Climate resilient agricultural technologies',
        ],
        applicationProcess: [
          'Apply through District Agriculture Office',
          'Submit proposal with required documents',
          'Approval by district/state level committee',
          'Implementation and monitoring',
        ],
        documents: [
          'Land records',
          'Identity proof',
          'Bank account details',
          'Project proposal (if applicable)',
        ],
        lastDateToApply: '2023-08-15T00:00:00.000Z',
        contactDetails: {
          phone: '011-23384929',
          email: 'nmsa-agriculture@gov.in',
          website: 'https://nmsa.dac.gov.in',
        },
        status: 'active',
        relevance: 'medium',
        additionalInfo:
          'NMSA has various components including Rainfed Area Development (RAD), Soil Health Management (SHM), and Climate Change and Sustainable Agriculture Monitoring, Modeling and Networking (CCSAMMN).',
      },
      {
        _id: '7',
        title: 'Agricultural Marketing Infrastructure (AMI)',
        description:
          'A sub-scheme of Integrated Scheme for Agricultural Marketing (ISAM) that provides assistance for creating agricultural marketing infrastructure.',
        category: 'marketing',
        eligibility: [
          'Individual farmers',
          'Group of farmers/growers',
          'Registered FPOs/FPCs',
          'Cooperatives',
          'APMCs',
          'Marketing boards',
          'Private companies',
        ],
        benefits: [
          'Financial assistance for storage infrastructure',
          'Support for setting up cleaning, grading, and packaging facilities',
          'Assistance for mobile pre-coolers and reefer vehicles',
          'Credit-linked back-ended subsidy',
        ],
        applicationProcess: [
          'Submit application to NABARD/NCDC/DMI',
          'Prepare detailed project report',
          'Get approval from sanctioning committee',
          'Implement project and claim subsidy',
        ],
        documents: [
          'Detailed project report',
          'Land documents',
          'Cost estimates',
          'Bank sanction letter (for bank loans)',
          'Registration certificate (for companies/cooperatives)',
        ],
        lastDateToApply: '2023-12-31T00:00:00.000Z',
        contactDetails: {
          phone: '011-23389651',
          email: 'isam-agri@gov.in',
          website: 'https://agmarknet.gov.in',
        },
        status: 'active',
        relevance: 'medium',
        additionalInfo:
          'Subsidy ranges from 25% to 33.33% of the capital cost depending on the category of beneficiary and location.',
      },
      {
        _id: '8',
        title: 'National Food Security Mission (NFSM)',
        description:
          'Aims to increase production of rice, wheat, pulses, coarse cereals, and commercial crops through area expansion and productivity enhancement.',
        category: 'production',
        eligibility: [
          'All farmers in identified districts',
          'Special focus on small and marginal farmers',
        ],
        benefits: [
          'Distribution of high-yielding varieties and hybrid seeds',
          'Demonstration of improved production technologies',
          'Resource conservation techniques',
          'Integrated pest management',
          'Cropping system-based training to farmers',
        ],
        applicationProcess: [
          'Contact District Agriculture Office',
          'Submit application for specific component',
          'Selection by district level committee',
          'Implementation and monitoring',
        ],
        documents: [
          'Land records',
          'Identity proof',
          'Bank account details',
        ],
        lastDateToApply: null, // Ongoing scheme
        contactDetails: {
          phone: '011-23381176',
          email: 'nfsm-agriculture@gov.in',
          website: 'https://nfsm.gov.in',
        },
        status: 'active',
        relevance: 'high',
        additionalInfo:
          'NFSM was launched in 2007-08 and has been instrumental in increasing the production of targeted crops.',
      },
      {
        _id: '9',
        title: 'Rashtriya Krishi Vikas Yojana (RKVY)',
        description:
          'A State Plan Scheme that provides flexibility and autonomy to states in planning and executing programs for agriculture development.',
        category: 'development',
        eligibility: [
          'State governments',
          'Farmers through state-implemented projects',
        ],
        benefits: [
          'Infrastructure and assets development',
          'Support for quality inputs and market development',
          'Flexi-funds to address state-specific needs',
          'Innovation and agri-entrepreneurship development',
        ],
        applicationProcess: [
          'States prepare State Agriculture Plans',
          'Projects approved by State Level Sanctioning Committee',
          'Farmers can participate in state-implemented projects',
          'Contact district agriculture office for local initiatives',
        ],
        documents: [
          'Varies based on specific project requirements',
          'Generally includes identity proof, land records, and bank details',
        ],
        lastDateToApply: null, // Varies by state and project
        contactDetails: {
          phone: '011-23382545',
          email: 'rkvy-agriculture@gov.in',
          website: 'https://rkvy.nic.in',
        },
        status: 'active',
        relevance: 'medium',
        additionalInfo:
          'RKVY was initiated in 2007-08 as an umbrella scheme for ensuring holistic development of agriculture and allied sectors.',
      },
      {
        _id: '10',
        title: 'PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)',
        description:
          'Provides financial and water security to farmers through harnessing solar energy for irrigation and additional income.',
        category: 'renewable-energy',
        eligibility: [
          'Farmers with grid-connected agriculture pumps',
          'Farmers with off-grid pumps wanting to solarize',
          'Individual farmers with barren/uncultivable land for solar plant installation',
        ],
        benefits: [
          'Subsidy for installation of solar pumps',
          'Solarization of existing grid-connected pumps',
          'Income through sale of excess solar power to DISCOM',
          'Reduced dependence on diesel for irrigation',
        ],
        applicationProcess: [
          'Apply through state nodal agency/agriculture department',
          'Submit application with required documents',
          'Selection based on criteria set by state government',
          'Installation through empaneled vendors',
        ],
        documents: [
          'Land ownership documents',
          'Identity proof',
          'Bank account details',
          'Existing pump details (for solarization)',
          'NOC from DISCOM (if applicable)',
        ],
        lastDateToApply: '2023-10-31T00:00:00.000Z',
        contactDetails: {
          phone: '1800-180-3333',
          email: 'kusum-mnre@gov.in',
          website: 'https://mnre.gov.in',
        },
        status: 'active',
        relevance: 'high',
        additionalInfo:
          'The scheme has three components: Component-A (setting up solar power plants), Component-B (installation of standalone solar pumps), and Component-C (solarization of grid-connected pumps).',
      },
    ];

    // Get farmer's saved schemes
    // In a real application, this would fetch from the database
    // const farmer = await Farmer.findById(req.user.id).select('savedSchemes');
    // const savedSchemes = farmer.savedSchemes || [];
    
    // For demo purposes, we'll use mock data
    const savedSchemes = ['1', '3', '5'];

    res.status(200).json({
      success: true,
      schemes,
      savedSchemes,
    });
  } catch (error) {
    console.error('Error in getGovernmentSchemes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Save a government scheme to farmer's saved schemes
 * @route POST /api/farmer/government-schemes/save
 * @access Private (Farmer)
 */
exports.saveScheme = async (req, res) => {
  try {
    const { schemeId } = req.body;
    const farmerId = req.user.id;

    if (!schemeId) {
      return res.status(400).json({
        success: false,
        message: 'Scheme ID is required',
      });
    }

    // In a real application, this would update the farmer's saved schemes in the database
    // const farmer = await Farmer.findById(farmerId);
    // if (!farmer) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Farmer not found',
    //   });
    // }
    // 
    // // Add to saved schemes if not already saved
    // if (!farmer.savedSchemes) {
    //   farmer.savedSchemes = [];
    // }
    // 
    // if (!farmer.savedSchemes.includes(schemeId)) {
    //   farmer.savedSchemes.push(schemeId);
    //   await farmer.save();
    // }

    // For demo purposes, we'll just return a success response
    res.status(200).json({
      success: true,
      message: 'Scheme saved successfully',
    });
  } catch (error) {
    console.error('Error in saveScheme:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Remove a government scheme from farmer's saved schemes
 * @route DELETE /api/farmer/government-schemes/save/:schemeId
 * @access Private (Farmer)
 */
exports.unsaveScheme = async (req, res) => {
  try {
    const { schemeId } = req.params;
    const farmerId = req.user.id;

    if (!schemeId) {
      return res.status(400).json({
        success: false,
        message: 'Scheme ID is required',
      });
    }

    // In a real application, this would update the farmer's saved schemes in the database
    // const farmer = await Farmer.findById(farmerId);
    // if (!farmer) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Farmer not found',
    //   });
    // }
    // 
    // // Remove from saved schemes if exists
    // if (farmer.savedSchemes && farmer.savedSchemes.includes(schemeId)) {
    //   farmer.savedSchemes = farmer.savedSchemes.filter(id => id.toString() !== schemeId);
    //   await farmer.save();
    // }

    // For demo purposes, we'll just return a success response
    res.status(200).json({
      success: true,
      message: 'Scheme removed from saved items',
    });
  } catch (error) {
    console.error('Error in unsaveScheme:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Apply for a government scheme
 * @route POST /api/farmer/government-schemes/apply
 * @access Private (Farmer)
 */
exports.applyForScheme = async (req, res) => {
  try {
    const { schemeId, documents } = req.body;
    const farmerId = req.user.id;

    if (!schemeId) {
      return res.status(400).json({
        success: false,
        message: 'Scheme ID is required',
      });
    }

    // In a real application, this would create an application record in the database
    // const scheme = await GovernmentScheme.findById(schemeId);
    // if (!scheme) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Scheme not found',
    //   });
    // }
    // 
    // // Check if scheme is active and application period is open
    // if (scheme.status !== 'active' || 
    //     (scheme.lastDateToApply && new Date(scheme.lastDateToApply) < new Date())) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'This scheme is not accepting applications at this time',
    //   });
    // }
    // 
    // // Check if farmer has already applied
    // const existingApplication = await SchemeApplication.findOne({
    //   farmer: farmerId,
    //   scheme: schemeId,
    //   status: { $nin: ['rejected'] },
    // });
    // 
    // if (existingApplication) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'You have already applied for this scheme',
    //     data: {
    //       applicationId: existingApplication.applicationId,
    //       status: existingApplication.status,
    //     },
    //   });
    // }
    // 
    // // Create new application
    // const application = new SchemeApplication({
    //   farmer: farmerId,
    //   scheme: schemeId,
    //   documents: documents || [],
    //   history: [{
    //     status: 'pending',
    //     remarks: 'Application submitted',
    //     updatedBy: farmerId,
    //   }],
    // });
    // 
    // await application.save();

    // For demo purposes, we'll just return a success response with a mock application ID
    const applicationId = 'APP-' + Math.floor(Math.random() * 1000000);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        applicationId,
        status: 'pending',
        appliedOn: new Date(),
      },
    });
  } catch (error) {
    console.error('Error in applyForScheme:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get farmer's scheme applications
 * @route GET /api/farmer/government-schemes/applications
 * @access Private (Farmer)
 */
exports.getSchemeApplications = async (req, res) => {
  try {
    const farmerId = req.user.id;

    // In a real application, this would fetch the farmer's applications from the database
    // const applications = await SchemeApplication.find({ farmer: farmerId })
    //   .populate('scheme', 'title category')
    //   .sort({ createdAt: -1 });

    // For demo purposes, we'll return mock data
    const applications = [
      {
        _id: 'app1',
        schemeId: '1',
        schemeTitle: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        applicationId: 'APP-123456',
        status: 'approved',
        appliedOn: '2023-01-15T00:00:00.000Z',
        updatedOn: '2023-01-20T00:00:00.000Z',
        remarks: 'All documents verified. Application approved.',
      },
      {
        _id: 'app2',
        schemeId: '3',
        schemeTitle: 'Kisan Credit Card (KCC) Scheme',
        applicationId: 'APP-789012',
        status: 'pending',
        appliedOn: '2023-02-10T00:00:00.000Z',
        updatedOn: '2023-02-10T00:00:00.000Z',
        remarks: 'Application under review.',
      },
      {
        _id: 'app3',
        schemeId: '5',
        schemeTitle: 'PM Krishi Sinchai Yojana (PMKSY)',
        applicationId: 'APP-345678',
        status: 'rejected',
        appliedOn: '2022-11-05T00:00:00.000Z',
        updatedOn: '2022-11-15T00:00:00.000Z',
        remarks: 'Land documents not clear. Please reapply with clear documents.',
      },
    ];

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error('Error in getSchemeApplications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get relevant schemes for a farmer based on their profile
 * @route GET /api/farmer/government-schemes/relevant
 * @access Private (Farmer)
 */
exports.getRelevantSchemes = async (req, res) => {
  try {
    const farmerId = req.user.id;

    // In a real application, this would fetch relevant schemes based on farmer's profile
    // const farmer = await Farmer.findById(farmerId);
    // if (!farmer) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Farmer not found',
    //   });
    // }
    // 
    // const relevantSchemes = await GovernmentScheme.findRelevantSchemes(farmer);

    // For demo purposes, we'll return mock data with high relevance schemes
    const relevantSchemes = [
      {
        _id: '1',
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        description:
          'A crop insurance scheme that provides financial support to farmers in case of crop failure due to natural calamities, pests, and diseases.',
        category: 'insurance',
        relevance: 'high',
        lastDateToApply: '2023-07-31T00:00:00.000Z',
      },
      {
        _id: '2',
        title: 'PM Kisan Samman Nidhi Yojana',
        description:
          'A central sector scheme to provide income support to all landholding farmers\'s families in the country to supplement their financial needs.',
        category: 'financial-assistance',
        relevance: 'high',
        lastDateToApply: null,
      },
      {
        _id: '5',
        title: 'PM Krishi Sinchai Yojana (PMKSY)',
        description:
          'Aims to ensure access to irrigation to all agricultural farms to produce \'per drop more crop\' and improve water use efficiency.',
        category: 'infrastructure',
        relevance: 'high',
        lastDateToApply: '2023-09-30T00:00:00.000Z',
      },
    ];

    res.status(200).json({
      success: true,
      schemes: relevantSchemes,
    });
  } catch (error) {
    console.error('Error in getRelevantSchemes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};