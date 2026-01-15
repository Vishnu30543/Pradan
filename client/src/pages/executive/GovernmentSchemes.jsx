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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Avatar,
  Checkbox,
  FormControlLabel,
  IconButton,
} from '@mui/material'
import {
  Search as SearchIcon,
  Policy as PolicyIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Person as PersonIcon,
  Agriculture as AgricultureIcon,
  AttachMoney as MoneyIcon,
  Description as DocumentIcon,
} from '@mui/icons-material'
import axios from 'axios'

const GovernmentSchemes = () => {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterRelevance, setFilterRelevance] = useState('')
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [openDetailDialog, setOpenDetailDialog] = useState(false)
  const [openShareDialog, setOpenShareDialog] = useState(false)
  const [farmers, setFarmers] = useState([])
  const [selectedFarmers, setSelectedFarmers] = useState([])
  const [tabValue, setTabValue] = useState(0)
  const [savedSchemes, setSavedSchemes] = useState([])
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  const categories = [
    { value: 'insurance', label: 'Insurance', icon: '🛡️' },
    { value: 'financial-assistance', label: 'Financial Assistance', icon: '💰' },
    { value: 'credit', label: 'Credit', icon: '🏦' },
    { value: 'technical-assistance', label: 'Technical Assistance', icon: '🔧' },
    { value: 'infrastructure', label: 'Infrastructure', icon: '🏗️' },
    { value: 'sustainable-farming', label: 'Sustainable Farming', icon: '🌱' },
    { value: 'marketing', label: 'Marketing', icon: '📈' },
    { value: 'production', label: 'Production', icon: '🌾' },
    { value: 'development', label: 'Development', icon: '📊' },
    { value: 'renewable-energy', label: 'Renewable Energy', icon: '☀️' },
    { value: 'other', label: 'Other', icon: '📋' },
  ]

  useEffect(() => {
    fetchSchemes()
    fetchFarmers()
  }, [])

  const fetchSchemes = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/scheme-management/schemes')
      setSchemes(response.data.schemes || [])
    } catch (err) {
      console.error('Error fetching schemes:', err)
      // Use sample data for demo
      setSchemes(getSampleSchemes())
    } finally {
      setLoading(false)
    }
  }

  const fetchFarmers = async () => {
    try {
      const response = await axios.get('/api/executive/farmers')
      setFarmers(response.data.farmers || [])
    } catch (err) {
      console.error('Error fetching farmers:', err)
    }
  }

  const getSampleSchemes = () => [
    {
      _id: '1',
      title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      description: 'Income support of ₹6,000 per year to all farmer families across the country in three equal installments of ₹2,000 each.',
      category: 'financial-assistance',
      eligibility: ['All farmer families with cultivable land', 'Subject to exclusion criteria'],
      benefits: ['₹6,000 per year in 3 installments', 'Direct bank transfer', 'No interest or repayment required'],
      applicationProcess: ['Register on PM-KISAN portal', 'Submit Aadhaar and bank details', 'Land verification by local authorities'],
      documents: ['Aadhaar Card', 'Bank Account Details', 'Land Records'],
      lastDateToApply: null,
      contactDetails: { phone: '1800-11-5526', email: 'pmkisan-ict@gov.in', website: 'https://pmkisan.gov.in' },
      status: 'active',
      relevance: 'high',
    },
    {
      _id: '2',
      title: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
      description: 'Crop insurance scheme providing financial support to farmers suffering crop loss due to natural calamities, pests, and diseases.',
      category: 'insurance',
      eligibility: ['All farmers growing notified crops', 'Both loanee and non-loanee farmers'],
      benefits: ['Low premium rates (2% for Kharif, 1.5% for Rabi)', 'Coverage for prevented sowing', 'Post-harvest losses covered'],
      applicationProcess: ['Apply through bank or CSC', 'Pay premium share', 'Automatic claim settlement'],
      documents: ['Land Records', 'Sowing Certificate', 'Bank Account Details'],
      lastDateToApply: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      contactDetails: { phone: '1800-200-7710', email: 'help.agri-insurance@gov.in', website: 'https://pmfby.gov.in' },
      status: 'active',
      relevance: 'high',
    },
    {
      _id: '3',
      title: 'Kisan Credit Card (KCC)',
      description: 'Provides farmers with short-term credit for crop production, working capital, and allied activities at subsidized interest rates.',
      category: 'credit',
      eligibility: ['All farmers including tenant farmers', 'SHGs or Joint Liability Groups'],
      benefits: ['Credit up to ₹3 lakh at 7% interest', '3% interest subvention for timely repayment', 'Flexible repayment options'],
      applicationProcess: ['Apply at nearest bank branch', 'Submit land and identity documents', 'Credit assessment and card issuance'],
      documents: ['Land Records', 'Identity Proof', 'Passport Size Photos', 'Application Form'],
      lastDateToApply: null,
      contactDetails: { phone: '14155', email: 'help@pmkisan.gov.in', website: 'https://www.nabard.org' },
      status: 'active',
      relevance: 'high',
    },
    {
      _id: '4',
      title: 'Soil Health Card Scheme',
      description: 'Provides soil health cards to farmers carrying crop-wise recommendations of nutrients and fertilizers.',
      category: 'technical-assistance',
      eligibility: ['All farmers owning agricultural land', 'No income or land size restrictions'],
      benefits: ['Free soil testing', 'Personalized fertilizer recommendations', 'Improved crop yield guidance'],
      applicationProcess: ['Register at local agriculture office', 'Soil sample collection', 'Receive Soil Health Card'],
      documents: ['Land Records', 'Identity Proof'],
      lastDateToApply: null,
      contactDetails: { phone: '1800-180-1551', email: 'soilhealth@gov.in', website: 'https://soilhealth.dac.gov.in' },
      status: 'active',
      relevance: 'medium',
    },
    {
      _id: '5',
      title: 'PM Kusum (Solar Energy Scheme)',
      description: 'Promotes installation of solar pumps and grid-connected solar power plants for farmers.',
      category: 'renewable-energy',
      eligibility: ['Farmers owning irrigation pumps', 'Farmers with barren or fallow land'],
      benefits: ['60% subsidy on solar pumps', 'Additional income from solar power sale', 'Reduced electricity bills'],
      applicationProcess: ['Apply through state nodal agency', 'Site inspection and approval', 'Installation and commissioning'],
      documents: ['Land Records', 'Bank Account', 'Electricity Connection (if existing)'],
      lastDateToApply: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      contactDetails: { phone: '1800-180-3333', email: 'kusum.mnre@gov.in', website: 'https://pmkusum.mnre.gov.in' },
      status: 'active',
      relevance: 'medium',
    },
    {
      _id: '6',
      title: 'National Agriculture Market (e-NAM)',
      description: 'Pan-India electronic trading portal which networks existing APMC mandis to create a unified national market for agricultural commodities.',
      category: 'marketing',
      eligibility: ['All farmers with agricultural produce', 'Registered with local APMC'],
      benefits: ['Better price discovery', 'Transparent bidding', 'Direct payment to bank account'],
      applicationProcess: ['Register on e-NAM portal', 'Link bank account', 'Sell through e-NAM mandis'],
      documents: ['Aadhaar Card', 'Bank Account', 'Produce Quality Certificate'],
      lastDateToApply: null,
      contactDetails: { phone: '1800-270-0224', email: 'nam@sfac.in', website: 'https://enam.gov.in' },
      status: 'active',
      relevance: 'medium',
    },
  ]

  const handleViewScheme = (scheme) => {
    setSelectedScheme(scheme)
    setOpenDetailDialog(true)
  }

  const handleShareScheme = (scheme) => {
    setSelectedScheme(scheme)
    setSelectedFarmers([])
    setOpenShareDialog(true)
  }

  const handleToggleSave = (schemeId) => {
    setSavedSchemes(prev => {
      if (prev.includes(schemeId)) {
        return prev.filter(id => id !== schemeId)
      }
      return [...prev, schemeId]
    })
    setSnackbar({
      open: true,
      message: savedSchemes.includes(schemeId) ? 'Scheme removed from saved' : 'Scheme saved!',
      severity: 'success',
    })
  }

  const handleShareWithFarmers = async () => {
    if (selectedFarmers.length === 0) {
      setSnackbar({ open: true, message: 'Please select at least one farmer', severity: 'error' })
      return
    }

    try {
      // Send SMS about scheme to selected farmers
      const message = `New Govt Scheme: ${selectedScheme.title}\n\nBenefits: ${selectedScheme.benefits[0]}\n\nContact: ${selectedScheme.contactDetails?.phone || 'N/A'}\n\nVisit: ${selectedScheme.contactDetails?.website || 'N/A'}`

      await axios.post('/api/executive/sms', {
        message,
        farmerIds: selectedFarmers,
      })

      setSnackbar({
        open: true,
        message: `Scheme shared with ${selectedFarmers.length} farmer(s)!`,
        severity: 'success',
      })
      setOpenShareDialog(false)
    } catch (err) {
      console.error('Error sharing scheme:', err)
      setSnackbar({
        open: true,
        message: 'Failed to share scheme. Please try again.',
        severity: 'error',
      })
    }
  }

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory ? scheme.category === filterCategory : true
    const matchesRelevance = filterRelevance ? scheme.relevance === filterRelevance : true
    const matchesTab = tabValue === 1 ? savedSchemes.includes(scheme._id) : true
    return matchesSearch && matchesCategory && matchesRelevance && matchesTab
  })

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category)
    return cat?.icon || '📋'
  }

  const getRelevanceColor = (relevance) => {
    const colors = { high: 'error', medium: 'warning', low: 'default' }
    return colors[relevance] || 'default'
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PolicyIcon color="primary" />
        Government Schemes
      </Typography>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab icon={<PolicyIcon />} label={`All Schemes (${schemes.length})`} />
        <Tab icon={<BookmarkIcon />} label={`Saved (${savedSchemes.length})`} />
      </Tabs>

      {/* Search and Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search schemes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} label="Category">
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Relevance</InputLabel>
              <Select value={filterRelevance} onChange={(e) => setFilterRelevance(e.target.value)} label="Relevance">
                <MenuItem value="">All</MenuItem>
                <MenuItem value="high">🔴 High</MenuItem>
                <MenuItem value="medium">🟡 Medium</MenuItem>
                <MenuItem value="low">⚪ Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Schemes Grid */}
      <Grid container spacing={3}>
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme) => (
            <Grid item xs={12} sm={6} md={4} key={scheme._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="caption" sx={{ fontSize: '1.5rem' }}>
                      {getCategoryIcon(scheme.category)}
                    </Typography>
                    <Chip
                      label={scheme.relevance}
                      color={getRelevanceColor(scheme.relevance)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 600 }}>
                    {scheme.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {scheme.description.substring(0, 120)}...
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                    <Chip
                      icon={<EventIcon />}
                      label={scheme.lastDateToApply
                        ? `Apply by ${new Date(scheme.lastDateToApply).toLocaleDateString()}`
                        : 'Ongoing'}
                      size="small"
                      variant="outlined"
                      color={scheme.lastDateToApply ? 'warning' : 'success'}
                    />
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Button size="small" onClick={() => handleViewScheme(scheme)}>
                    View Details
                  </Button>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleSave(scheme._id)}
                      color={savedSchemes.includes(scheme._id) ? 'primary' : 'default'}
                    >
                      {savedSchemes.includes(scheme._id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                    <IconButton size="small" color="primary" onClick={() => handleShareScheme(scheme)}>
                      <ShareIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <PolicyIcon sx={{ fontSize: 60, color: 'grey.400' }} />
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                {tabValue === 1 ? 'No saved schemes' : 'No schemes found matching your criteria'}
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Scheme Detail Dialog */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="md" fullWidth>
        {selectedScheme && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" sx={{ fontSize: '1.5rem' }}>
                  {getCategoryIcon(selectedScheme.category)}
                </Typography>
                <Box>
                  <Typography variant="h6">{selectedScheme.title}</Typography>
                  <Chip
                    label={categories.find(c => c.value === selectedScheme.category)?.label}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Alert severity="info" icon={<InfoIcon />}>
                    {selectedScheme.description}
                  </Alert>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon fontSize="small" />
                        Eligibility Criteria
                      </Typography>
                      <List dense>
                        {(selectedScheme.eligibility || []).map((item, i) => (
                          <ListItem key={i}>
                            <ListItemIcon sx={{ minWidth: 24 }}>•</ListItemIcon>
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="success.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MoneyIcon fontSize="small" />
                        Benefits
                      </Typography>
                      <List dense>
                        {(selectedScheme.benefits || []).map((item, i) => (
                          <ListItem key={i}>
                            <ListItemIcon sx={{ minWidth: 24 }}>✓</ListItemIcon>
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="info.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AgricultureIcon fontSize="small" />
                        Application Process
                      </Typography>
                      <List dense>
                        {(selectedScheme.applicationProcess || []).map((item, i) => (
                          <ListItem key={i}>
                            <ListItemIcon sx={{ minWidth: 24 }}>{i + 1}.</ListItemIcon>
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="warning.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DocumentIcon fontSize="small" />
                        Required Documents
                      </Typography>
                      <List dense>
                        {(selectedScheme.documents || []).map((item, i) => (
                          <ListItem key={i}>
                            <ListItemIcon sx={{ minWidth: 24 }}>📄</ListItemIcon>
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>Contact Details</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon color="primary" fontSize="small" />
                            <Typography variant="body2">{selectedScheme.contactDetails?.phone || 'N/A'}</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon color="primary" fontSize="small" />
                            <Typography variant="body2">{selectedScheme.contactDetails?.email || 'N/A'}</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WebsiteIcon color="primary" fontSize="small" />
                            {selectedScheme.contactDetails?.website ? (
                              <a href={selectedScheme.contactDetails.website} target="_blank" rel="noopener noreferrer">
                                Visit Website
                              </a>
                            ) : 'N/A'}
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDetailDialog(false)}>Close</Button>
              <Button
                variant="outlined"
                startIcon={savedSchemes.includes(selectedScheme._id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                onClick={() => handleToggleSave(selectedScheme._id)}
              >
                {savedSchemes.includes(selectedScheme._id) ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="contained"
                startIcon={<ShareIcon />}
                onClick={() => { setOpenDetailDialog(false); handleShareScheme(selectedScheme); }}
              >
                Share with Farmers
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Share with Farmers Dialog */}
      <Dialog open={openShareDialog} onClose={() => setOpenShareDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share Scheme with Farmers</DialogTitle>
        <DialogContent>
          {selectedScheme && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                Share "{selectedScheme.title}" with your farmers via SMS
              </Alert>
              <Typography variant="subtitle2" gutterBottom>Select Farmers:</Typography>
              <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto', p: 1 }}>
                {farmers.length > 0 ? (
                  farmers.map((farmer) => (
                    <FormControlLabel
                      key={farmer._id}
                      control={
                        <Checkbox
                          checked={selectedFarmers.includes(farmer._id)}
                          onChange={() => {
                            setSelectedFarmers(prev =>
                              prev.includes(farmer._id)
                                ? prev.filter(id => id !== farmer._id)
                                : [...prev, farmer._id]
                            )
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24 }}>
                            <PersonIcon sx={{ fontSize: 16 }} />
                          </Avatar>
                          <Typography variant="body2">{farmer.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({farmer.mobileNo})
                          </Typography>
                        </Box>
                      }
                      sx={{ display: 'block', mb: 0.5 }}
                    />
                  ))
                ) : (
                  <Typography color="text.secondary" textAlign="center" sx={{ p: 2 }}>
                    No farmers assigned
                  </Typography>
                )}
              </Paper>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  onClick={() => setSelectedFarmers(farmers.map(f => f._id))}
                >
                  Select All
                </Button>
                <Button
                  size="small"
                  onClick={() => setSelectedFarmers([])}
                >
                  Clear
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenShareDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<ShareIcon />}
            onClick={handleShareWithFarmers}
            disabled={selectedFarmers.length === 0}
          >
            Share via SMS ({selectedFarmers.length})
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default GovernmentSchemes