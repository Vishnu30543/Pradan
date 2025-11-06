import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Snackbar,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ExpandMore as ExpandMoreIcon,
  CalendarToday as CalendarTodayIcon,
  AttachMoney as AttachMoneyIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ArrowForward as ArrowForwardIcon,
  LocalOffer as LocalOfferIcon,
  Gavel as GavelIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const GovernmentSchemes = () => {
  const { user } = useAuth()
  const [schemes, setSchemes] = useState([])
  const [filteredSchemes, setFilteredSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [savedSchemes, setSavedSchemes] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState('initial') // initial, submitting, success, error

  useEffect(() => {
    fetchSchemes()
  }, [])

  const fetchSchemes = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/farmer/government-schemes')
      setSchemes(response.data.schemes)
      setFilteredSchemes(response.data.schemes)
      setError(null)
    } catch (err) {
      console.error('Error fetching schemes:', err)
      setError('Failed to load government schemes. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // For demo purposes, simulate API response with mock data
  useEffect(() => {
    const simulateApiResponse = () => {
      setTimeout(() => {
        const mockSchemes = [
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
        ]

        // Simulate saved schemes
        const mockSavedSchemes = ['1', '3', '5']

        setSchemes(mockSchemes)
        setFilteredSchemes(mockSchemes)
        setSavedSchemes(mockSavedSchemes)
        setLoading(false)
      }, 1000)
    }

    // Use mock data for demo
    simulateApiResponse()
    // In production, use the actual API call
    // fetchSchemes()
  }, [])

  useEffect(() => {
    filterSchemes()
  }, [searchTerm, selectedCategory, schemes])

  const filterSchemes = () => {
    let filtered = [...schemes]

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (scheme) =>
          scheme.title.toLowerCase().includes(term) ||
          scheme.description.toLowerCase().includes(term)
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (scheme) => scheme.category === selectedCategory
      )
    }

    setFilteredSchemes(filtered)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  const handleSchemeClick = (scheme) => {
    setSelectedScheme(scheme)
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const toggleSaveScheme = (schemeId) => {
    // In a real app, this would make an API call to save/unsave the scheme
    if (savedSchemes.includes(schemeId)) {
      setSavedSchemes(savedSchemes.filter((id) => id !== schemeId))
      showSnackbar('Scheme removed from saved items', 'info')
    } else {
      setSavedSchemes([...savedSchemes, schemeId])
      showSnackbar('Scheme saved successfully', 'success')
    }
  }

  const handleApplyClick = (scheme) => {
    setSelectedScheme(scheme)
    setApplicationStatus('initial')
    setApplyDialogOpen(true)
  }

  const handleApplyDialogClose = () => {
    setApplyDialogOpen(false)
  }

  const handleSubmitApplication = () => {
    // In a real app, this would submit the application to the backend
    setApplicationStatus('submitting')

    // Simulate API call
    setTimeout(() => {
      setApplicationStatus('success')
      // In a real app, you would update the UI based on the response
      showSnackbar('Application submitted successfully', 'success')
    }, 2000)
  }

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'insurance':
        return <GavelIcon />
      case 'financial-assistance':
        return <AttachMoneyIcon />
      case 'credit':
        return <AccountBalanceIcon />
      case 'technical-assistance':
        return <AssignmentIcon />
      case 'infrastructure':
        return <AccountBalanceIcon />
      case 'sustainable-farming':
        return <LocalOfferIcon />
      case 'marketing':
        return <LocalOfferIcon />
      case 'production':
        return <AssignmentIcon />
      case 'development':
        return <InfoIcon />
      case 'renewable-energy':
        return <InfoIcon />
      default:
        return <InfoIcon />
    }
  }

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'insurance':
        return 'Insurance'
      case 'financial-assistance':
        return 'Financial Assistance'
      case 'credit':
        return 'Credit & Loans'
      case 'technical-assistance':
        return 'Technical Assistance'
      case 'infrastructure':
        return 'Infrastructure'
      case 'sustainable-farming':
        return 'Sustainable Farming'
      case 'marketing':
        return 'Marketing'
      case 'production':
        return 'Production'
      case 'development':
        return 'Development'
      case 'renewable-energy':
        return 'Renewable Energy'
      default:
        return 'Other'
    }
  }

  const getRelevanceColor = (relevance) => {
    switch (relevance) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'info'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchSchemes}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom>
        Government Schemes
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="government schemes tabs"
        >
          <Tab label="All Schemes" />
          <Tab label="Saved Schemes" />
        </Tabs>
      </Box>

      {/* Search and Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search schemes..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<FilterListIcon />}
                label="All"
                onClick={() => handleCategoryChange('all')}
                color={selectedCategory === 'all' ? 'primary' : 'default'}
                variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
              />
              <Chip
                icon={<GavelIcon />}
                label="Insurance"
                onClick={() => handleCategoryChange('insurance')}
                color={
                  selectedCategory === 'insurance' ? 'primary' : 'default'
                }
                variant={
                  selectedCategory === 'insurance' ? 'filled' : 'outlined'
                }
              />
              <Chip
                icon={<AttachMoneyIcon />}
                label="Financial"
                onClick={() => handleCategoryChange('financial-assistance')}
                color={
                  selectedCategory === 'financial-assistance'
                    ? 'primary'
                    : 'default'
                }
                variant={
                  selectedCategory === 'financial-assistance'
                    ? 'filled'
                    : 'outlined'
                }
              />
              <Chip
                icon={<AccountBalanceIcon />}
                label="Credit"
                onClick={() => handleCategoryChange('credit')}
                color={selectedCategory === 'credit' ? 'primary' : 'default'}
                variant={selectedCategory === 'credit' ? 'filled' : 'outlined'}
              />
              <Chip
                icon={<LocalOfferIcon />}
                label="Marketing"
                onClick={() => handleCategoryChange('marketing')}
                color={
                  selectedCategory === 'marketing' ? 'primary' : 'default'
                }
                variant={
                  selectedCategory === 'marketing' ? 'filled' : 'outlined'
                }
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Schemes List */}
      {tabValue === 0 && (
        <>
          {filteredSchemes.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No schemes found
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Try adjusting your search or filter criteria.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
              >
                Clear Filters
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredSchemes.map((scheme) => (
                <Grid item xs={12} md={6} key={scheme._id}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6" component="div">
                          {scheme.title}
                        </Typography>
                        <Box>
                          <IconButton
                            aria-label={`${
                              savedSchemes.includes(scheme._id)
                                ? 'Unsave'
                                : 'Save'
                            } scheme`}
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleSaveScheme(scheme._id)
                            }}
                            color={
                              savedSchemes.includes(scheme._id)
                                ? 'primary'
                                : 'default'
                            }
                          >
                            {savedSchemes.includes(scheme._id) ? (
                              <BookmarkIcon />
                            ) : (
                              <BookmarkBorderIcon />
                            )}
                          </IconButton>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                          size="small"
                          icon={getCategoryIcon(scheme.category)}
                          label={getCategoryLabel(scheme.category)}
                        />
                        <Chip
                          size="small"
                          color={getRelevanceColor(scheme.relevance)}
                          label={`${scheme.relevance.charAt(0).toUpperCase() + 
                            scheme.relevance.slice(1)} Relevance`}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {scheme.description}
                      </Typography>

                      {scheme.lastDateToApply && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mt: 1,
                            color:
                              new Date(scheme.lastDateToApply) < new Date()
                                ? 'error.main'
                                : 'text.secondary',
                          }}
                        >
                          <CalendarTodayIcon
                            fontSize="small"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2">
                            {new Date(scheme.lastDateToApply) < new Date()
                              ? 'Application Closed: '
                              : 'Last Date to Apply: '}
                            {new Date(
                              scheme.lastDateToApply
                            ).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => handleSchemeClick(scheme)}
                        endIcon={<ArrowForwardIcon />}
                      >
                        View Details
                      </Button>
                      {scheme.status === 'active' &&
                        (!scheme.lastDateToApply ||
                          new Date(scheme.lastDateToApply) > new Date()) && (
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => handleApplyClick(scheme)}
                          >
                            Apply Now
                          </Button>
                        )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Saved Schemes */}
      {tabValue === 1 && (
        <>
          {savedSchemes.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No saved schemes
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Save schemes that interest you for quick access later.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setTabValue(0)}
              >
                Browse Schemes
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {schemes
                .filter((scheme) => savedSchemes.includes(scheme._id))
                .map((scheme) => (
                  <Grid item xs={12} md={6} key={scheme._id}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 1,
                          }}
                        >
                          <Typography variant="h6" component="div">
                            {scheme.title}
                          </Typography>
                          <IconButton
                            aria-label="Unsave scheme"
                            onClick={() => toggleSaveScheme(scheme._id)}
                            color="primary"
                          >
                            <BookmarkIcon />
                          </IconButton>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <Chip
                            size="small"
                            icon={getCategoryIcon(scheme.category)}
                            label={getCategoryLabel(scheme.category)}
                          />
                          <Chip
                            size="small"
                            color={getRelevanceColor(scheme.relevance)}
                            label={`${scheme.relevance.charAt(0).toUpperCase() + 
                              scheme.relevance.slice(1)} Relevance`}
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {scheme.description}
                        </Typography>

                        {scheme.lastDateToApply && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 1,
                              color:
                                new Date(scheme.lastDateToApply) < new Date()
                                  ? 'error.main'
                                  : 'text.secondary',
                            }}
                          >
                            <CalendarTodayIcon
                              fontSize="small"
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="body2">
                              {new Date(scheme.lastDateToApply) < new Date()
                                ? 'Application Closed: '
                                : 'Last Date to Apply: '}
                              {new Date(
                                scheme.lastDateToApply
                              ).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => handleSchemeClick(scheme)}
                          endIcon={<ArrowForwardIcon />}
                        >
                          View Details
                        </Button>
                        {scheme.status === 'active' &&
                          (!scheme.lastDateToApply ||
                            new Date(scheme.lastDateToApply) > new Date()) && (
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => handleApplyClick(scheme)}
                            >
                              Apply Now
                            </Button>
                          )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          )}
        </>
      )}

      {/* Scheme Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        {selectedScheme && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">{selectedScheme.title}</Typography>
                <IconButton
                  aria-label={`${
                    savedSchemes.includes(selectedScheme._id)
                      ? 'Unsave'
                      : 'Save'
                  } scheme`}
                  onClick={() => toggleSaveScheme(selectedScheme._id)}
                  color={
                    savedSchemes.includes(selectedScheme._id)
                      ? 'primary'
                      : 'default'
                  }
                >
                  {savedSchemes.includes(selectedScheme._id) ? (
                    <BookmarkIcon />
                  ) : (
                    <BookmarkBorderIcon />
                  )}
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    icon={getCategoryIcon(selectedScheme.category)}
                    label={getCategoryLabel(selectedScheme.category)}
                  />
                  <Chip
                    color={getRelevanceColor(selectedScheme.relevance)}
                    label={`${selectedScheme.relevance.charAt(0).toUpperCase() + 
                      selectedScheme.relevance.slice(1)} Relevance`}
                  />
                  <Chip
                    label={selectedScheme.status === 'active' ? 'Active' : 'Inactive'}
                    color={selectedScheme.status === 'active' ? 'success' : 'default'}
                  />
                </Box>

                <Typography variant="body1" paragraph>
                  {selectedScheme.description}
                </Typography>

                {selectedScheme.additionalInfo && (
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedScheme.additionalInfo}
                  </Typography>
                )}

                {selectedScheme.lastDateToApply && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mt: 1,
                      mb: 2,
                      color:
                        new Date(selectedScheme.lastDateToApply) < new Date()
                          ? 'error.main'
                          : 'text.secondary',
                    }}
                  >
                    <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {new Date(selectedScheme.lastDateToApply) < new Date()
                        ? 'Application Closed: '
                        : 'Last Date to Apply: '}
                      {new Date(
                        selectedScheme.lastDateToApply
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Eligibility</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {selectedScheme.eligibility.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Benefits</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {selectedScheme.benefits.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Application Process</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {selectedScheme.applicationProcess.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {index + 1}.
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Required Documents</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {selectedScheme.documents.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <AssignmentIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Contact Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Helpline"
                        secondary={selectedScheme.contactDetails.phone}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Email"
                        secondary={selectedScheme.contactDetails.email}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Website"
                        secondary={
                          <a
                            href={selectedScheme.contactDetails.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {selectedScheme.contactDetails.website}
                          </a>
                        }
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            </DialogContent>
            <DialogActions>
              <Button
                startIcon={<ShareIcon />}
                onClick={() => {
                  // In a real app, this would open a share dialog
                  showSnackbar('Share functionality would be implemented here', 'info')
                }}
              >
                Share
              </Button>
              <Button
                startIcon={<DownloadIcon />}
                onClick={() => {
                  // In a real app, this would download scheme details
                  showSnackbar('Download functionality would be implemented here', 'info')
                }}
              >
                Download
              </Button>
              <Button onClick={handleDialogClose}>Close</Button>
              {selectedScheme.status === 'active' &&
                (!selectedScheme.lastDateToApply ||
                  new Date(selectedScheme.lastDateToApply) > new Date()) && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      handleDialogClose()
                      handleApplyClick(selectedScheme)
                    }}
                  >
                    Apply Now
                  </Button>
                )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Apply Dialog */}
      <Dialog
        open={applyDialogOpen}
        onClose={handleApplyDialogClose}
        maxWidth="sm"
        fullWidth
      >
        {selectedScheme && (
          <>
            <DialogTitle>Apply for {selectedScheme.title}</DialogTitle>
            <DialogContent>
              {applicationStatus === 'initial' && (
                <>
                  <Typography variant="body1" paragraph>
                    You are about to apply for this scheme. Please note that you
                    will need the following documents:
                  </Typography>
                  <List dense>
                    {selectedScheme.documents.map((doc, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <AssignmentIcon />
                        </ListItemIcon>
                        <ListItemText primary={doc} />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    In a real application, this would include a form to upload
                    documents and provide additional information required for the
                    application.
                  </Typography>
                </>
              )}

              {applicationStatus === 'submitting' && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 3,
                  }}
                >
                  <CircularProgress sx={{ mb: 2 }} />
                  <Typography variant="body1">Submitting application...</Typography>
                </Box>
              )}

              {applicationStatus === 'success' && (
                <Box sx={{ py: 2 }}>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Your application has been submitted successfully!
                  </Alert>
                  <Typography variant="body1" paragraph>
                    Application Reference Number: APP-{Math.floor(
                      Math.random() * 1000000
                    )}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    You will receive updates about your application status via SMS
                    and in the app notifications. You can also check the status in
                    your profile section.
                  </Typography>
                </Box>
              )}

              {applicationStatus === 'error' && (
                <Box sx={{ py: 2 }}>
                  <Alert severity="error" sx={{ mb: 2 }}>
                    There was an error submitting your application. Please try
                    again.
                  </Alert>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              {applicationStatus === 'initial' && (
                <>
                  <Button onClick={handleApplyDialogClose}>Cancel</Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitApplication}
                  >
                    Submit Application
                  </Button>
                </>
              )}

              {(applicationStatus === 'success' ||
                applicationStatus === 'error') && (
                <Button onClick={handleApplyDialogClose}>Close</Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default GovernmentSchemes