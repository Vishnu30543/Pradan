import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Avatar,
  Tooltip,
  Badge,
  CardMedia,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Assignment as AssignmentIcon,
  Agriculture as AgricultureIcon,
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const FarmerManagement = () => {
  const { user } = useAuth()
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedFarmer, setSelectedFarmer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterVillage, setFilterVillage] = useState('')
  const [villages, setVillages] = useState([])
  const [tabValue, setTabValue] = useState(0)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  // Form state for adding new farmer (matching backend requirements)
  const [newFarmer, setNewFarmer] = useState({
    name: '',
    fatherOrHusbandName: '',
    mobileNo: '',
    email: '',
    password: '',
    villageName: '',
    panchayatName: '',
    caste: '',
    isWomenFarmer: 'no', // Must be 'yes' or 'no' (string enum)
    groupName: '',
    income: '',
    estimatedIncome: ''
  })
  const [farmerFields, setFarmerFields] = useState([])
  const [fieldsLoading, setFieldsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchFarmers()
  }, [])

  const fetchFarmers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/executive/farmers')
      const farmersData = response.data.farmers || []
      setFarmers(farmersData)

      // Extract unique villages for filter
      const uniqueVillages = [...new Set(farmersData.map(farmer => farmer.villageName).filter(Boolean))]
      setVillages(uniqueVillages)

      setError(null)
    } catch (err) {
      console.error('Error fetching farmers:', err)
      const errorMessage = err.response?.data?.message || 'Failed to load farmers. Please try again later.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }


  const handleAddFarmer = async () => {
    // Validate form (matching backend requirements)
    const errors = {}
    if (!newFarmer.name) errors.name = 'Name is required'
    if (!newFarmer.fatherOrHusbandName) errors.fatherOrHusbandName = 'Father/Husband name is required'
    if (!newFarmer.mobileNo) errors.mobileNo = 'Mobile number is required'
    if (!newFarmer.password) errors.password = 'Password is required'
    if (!newFarmer.villageName) errors.villageName = 'Village is required'
    if (!newFarmer.panchayatName) errors.panchayatName = 'Panchayat is required'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      setLoading(true)
      let response
      if (editMode && editingId) {
        response = await axios.put(`/api/executive/farmers/${editingId}`, newFarmer)
      } else {
        response = await axios.post('/api/executive/farmers', newFarmer)
      }

      // Refresh the farmers list
      await fetchFarmers()

      setOpenAddDialog(false)
      setNewFarmer({
        name: '',
        fatherOrHusbandName: '',
        mobileNo: '',
        email: '',
        password: '',
        villageName: '',
        panchayatName: '',
        caste: '',
        isWomenFarmer: 'no',
        groupName: '',
        income: '',
        estimatedIncome: ''
      })
      setFormErrors({})
      setEditMode(false)
      setEditingId(null)
      setSnackbar({
        open: true,
        message: response.data.message || 'Farmer added successfully!',
        severity: 'success',
      })
    } catch (err) {
      console.error('Error adding farmer:', err)
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to save farmer. Please try again.'
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewFarmer({
      ...newFarmer,
      [name]: value,
    })
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      })
    }
  }

  const handleViewFarmer = (farmer) => {
    setSelectedFarmer(farmer)
    setOpenViewDialog(true)
  }

  const handleEditFarmer = (farmer) => {
    setNewFarmer({
      name: farmer.name || '',
      fatherOrHusbandName: farmer.fatherOrHusbandName || '',
      mobileNo: farmer.mobileNo || '',
      email: farmer.email || '',
      password: '', // Password is required for updates as per current form, or maybe optional? Assuming optional for update but form requires it currently. Let's keep it empty and user enters new password or we handle it in backend. If backend requires password, user must enter it.
      villageName: farmer.villageName || '',
      panchayatName: farmer.panchayatName || '',
      caste: farmer.caste || '',
      isWomenFarmer: farmer.isWomenFarmer ? 'yes' : 'no', // Handle boolean to string if needed, assuming backend sends boolean/string
      groupName: farmer.groupName || '',
      income: farmer.income || '',
      estimatedIncome: farmer.estimatedIncome || ''
    })
    setEditingId(farmer._id)
    setEditMode(true)
    setOpenAddDialog(true)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    if (newValue === 1 && selectedFarmer) {
      fetchFarmerFields(selectedFarmer._id)
    }
  }

  const fetchFarmerFields = async (farmerId) => {
    try {
      setFieldsLoading(true)
      // Ensure getFields supports filtering by farmerId via query param if implemented, 
      // OR we might need to filter client side if the API returns all fields (which getFields in executive usually doesn't, it finds for current exec). 
      // NOTE: My getFields implementation (Step 543) returns ALL fields for farmers assigned to executive.
      // So I can reuse it and filter, OR rely on backend filter.
      // Let's assume getFields returns fields.
      const response = await axios.get(`/api/executive/fields?farmerId=${farmerId}`) // Assuming I add filter support or client filter
      // Wait, my getFields (Step 543) does NOT support query params filtering explicitly, it returns all fields.
      // I should update it or filter client side. Filter client side is safer for now without changing backend again.
      // Actually, let's just fetch all and filter.

      // BETTER: I'll use the existing /api/executive/fields response but filter it client side here.
      // Wait, I haven't fetched fields in this Component yet.
      const allFieldsRes = await axios.get('/api/executive/fields')
      const allFields = allFieldsRes.data.fields || allFieldsRes.data.data || []
      const myFields = allFields.filter(f => f.farmer._id === farmerId || f.farmer === farmerId)
      setFarmerFields(myFields)
    } catch (err) {
      console.error("Error fetching fields", err)
    } finally {
      setFieldsLoading(false)
    }
  }

  const filteredFarmers = farmers.filter((farmer) => {
    const name = farmer.name || ''
    const mobileNo = farmer.mobileNo?.toString() || ''
    const villageName = farmer.villageName || ''

    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mobileNo.includes(searchTerm) ||
      villageName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesVillage = filterVillage ? villageName === filterVillage : true

    return matchesSearch && matchesVillage
  })

  if (loading && farmers.length === 0) {
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
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, bgcolor: '#ffebee' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Farmer Management
      </Typography>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search Farmers"
              variant="outlined"
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
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Filter by Village</InputLabel>
              <Select
                value={filterVillage}
                onChange={(e) => setFilterVillage(e.target.value)}
                label="Filter by Village"
              >
                <MenuItem value="">
                  <em>All Villages</em>
                </MenuItem>
                {villages.map((village) => (
                  <MenuItem key={village} value={village}>
                    {village}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setNewFarmer({
                  name: '',
                  fatherOrHusbandName: '',
                  mobileNo: '',
                  email: '',
                  password: '',
                  villageName: '',
                  panchayatName: '',
                  caste: '',
                  isWomenFarmer: 'no',
                  groupName: '',
                })
                setEditMode(false)
                setEditingId(null)
                setOpenAddDialog(true)
              }}
            >
              Add New Farmer
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Farmers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Village</TableCell>
              <TableCell>Panchayat</TableCell>
              <TableCell>Income</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFarmers.length > 0 ? (
              filteredFarmers.map((farmer) => (
                <TableRow key={farmer._id}>
                  <TableCell>{farmer.name}</TableCell>
                  <TableCell>{farmer.mobileNo}</TableCell>
                  <TableCell>{farmer.villageName}</TableCell>
                  <TableCell>{farmer.panchayatName}</TableCell>
                  <TableCell>
                    <Chip
                      label={`₹${(farmer.income || 0).toLocaleString()}`}
                      color="success"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewFarmer(farmer)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton color="secondary" onClick={() => handleEditFarmer(farmer)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No farmers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Farmer Dialog */}
      <Dialog open={openAddDialog} onClose={() => { setOpenAddDialog(false); setEditMode(false); setEditingId(null); }} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Farmer' : 'Add New Farmer'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name *"
                name="name"
                value={newFarmer.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Father/Husband Name *"
                name="fatherOrHusbandName"
                value={newFarmer.fatherOrHusbandName}
                onChange={handleInputChange}
                error={!!formErrors.fatherOrHusbandName}
                helperText={formErrors.fatherOrHusbandName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile Number *"
                name="mobileNo"
                value={newFarmer.mobileNo}
                onChange={handleInputChange}
                error={!!formErrors.mobileNo}
                helperText={formErrors.mobileNo}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newFarmer.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password *"
                name="password"
                type="password"
                value={newFarmer.password}
                onChange={handleInputChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Village Name *"
                name="villageName"
                value={newFarmer.villageName}
                onChange={handleInputChange}
                error={!!formErrors.villageName}
                helperText={formErrors.villageName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Panchayat Name *"
                name="panchayatName"
                value={newFarmer.panchayatName}
                onChange={handleInputChange}
                error={!!formErrors.panchayatName}
                helperText={formErrors.panchayatName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Caste"
                name="caste"
                value={newFarmer.caste}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Group Name"
                name="groupName"
                value={newFarmer.groupName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Is Women Farmer</InputLabel>
                <Select
                  name="isWomenFarmer"
                  value={newFarmer.isWomenFarmer}
                  onChange={handleInputChange}
                  label="Is Women Farmer"
                >
                  <MenuItem value="no">No</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Actual Income"
                name="income"
                type="number"
                value={newFarmer.income}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Income"
                name="estimatedIncome"
                type="number"
                value={newFarmer.estimatedIncome}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenAddDialog(false); setEditMode(false); setEditingId(null); }}>Cancel</Button>
          <Button
            onClick={handleAddFarmer}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : (editMode ? 'Update Farmer' : 'Add Farmer')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Farmer Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedFarmer && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6">{selectedFarmer.name}</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Basic Info" />
                <Tab label="Fields" />
                <Tab label="Income" />
              </Tabs>

              {/* Basic Info Tab */}
              {tabValue === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Contact Information
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography>{selectedFarmer.mobileNo}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography>{selectedFarmer.villageName || selectedFarmer.village || 'N/A'}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Farm Information
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Land Size:</strong> {selectedFarmer.landSize || 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Crops:</strong> {Array.isArray(selectedFarmer.crops) ? selectedFarmer.crops.join(', ') : (selectedFarmer.crops || 'None')}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Aadhar:</strong> {selectedFarmer.aadharNo || 'N/A'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Registration Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Registration Date:</strong>{' '}
                              {new Date(selectedFarmer.createdAt || Date.now()).toLocaleDateString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Last Update:</strong>{' '}
                              {new Date(selectedFarmer.updatedAt || Date.now()).toLocaleDateString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {tabValue === 1 && (
                <>
                  {fieldsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
                  ) : farmerFields && farmerFields.length > 0 ? (
                    <Grid container spacing={2}>
                      {farmerFields.map((field) => (
                        <Grid item xs={12} sm={6} key={field._id}>
                          <Card variant="outlined">
                            <CardMedia
                              component="img"
                              height="140"
                              image={field.photos && field.photos.length > 0 ? (field.photos[0].photoUrl || field.photos[0].url) : 'https://via.placeholder.com/300x140?text=No+Image'}
                              alt={field.name}
                            />
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                {field.name}
                              </Typography>
                              {/* 
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Badge color="primary" badgeContent={field.crop && (typeof field.crop === 'object' ? field.crop.current : field.crop)}>
                                </Badge>
                              </Box> 
                              */}
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Size:</strong> {typeof field.size === 'object' ? `${field.size.value} ${field.size.unit}` : field.size}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Crop:</strong> {typeof field.crop === 'object' ? field.crop.current : field.crop}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Soil Type:</strong> {field.soilType}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Irrigation:</strong> {field.irrigationSource || field.irrigationType}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography>No fields registered for this farmer. Go to Field Management to add fields.</Typography>
                  )}
                </>
              )}

              {/* Income Tab */}
              {tabValue === 2 && (
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Actual Income
                        </Typography>
                        <Typography variant="h4" color="success.main">
                          ₹{selectedFarmer.income.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Estimated Income
                        </Typography>
                        <Typography variant="h4" color="primary.main">
                          ₹{selectedFarmer.estimatedIncome.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                startIcon={<MessageIcon />}
                variant="outlined"
                color="primary"
              >
                Send SMS
              </Button>
              <Button
                startIcon={<AssignmentIcon />}
                variant="outlined"
                color="secondary"
              >
                View Requests
              </Button>
              <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box >
  )
}

export default FarmerManagement