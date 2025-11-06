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

  // Form state for adding new farmer
  const [newFarmer, setNewFarmer] = useState({
    name: '',
    mobileNo: '',
    village: '',
    landSize: '',
    crops: '',
    aadharNo: '',
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchFarmers()
  }, [])

  const fetchFarmers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/executive/farmers')
      setFarmers(response.data.farmers)
      
      // Extract unique villages for filter
      const uniqueVillages = [...new Set(response.data.farmers.map(farmer => farmer.village))]
      setVillages(uniqueVillages)
      
      setError(null)
    } catch (err) {
      console.error('Error fetching farmers:', err)
      setError('Failed to load farmers. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // For demo purposes, simulate API response with mock data
  useEffect(() => {
    const simulateApiResponse = () => {
      setTimeout(() => {
        const mockFarmers = [
          {
            _id: '1',
            name: 'Rajesh Kumar',
            mobileNo: '9876543210',
            village: 'Sundarpur',
            landSize: '5 acres',
            crops: 'Rice, Wheat',
            aadharNo: 'XXXX-XXXX-1234',
            registrationDate: '2023-01-15T08:30:00.000Z',
            lastVisitDate: '2023-06-05T10:15:00.000Z',
            fields: [
              {
                _id: 'f1',
                name: 'North Field',
                size: '3 acres',
                crop: 'Rice',
                soilType: 'Loamy',
                irrigationType: 'Drip',
              },
              {
                _id: 'f2',
                name: 'South Field',
                size: '2 acres',
                crop: 'Wheat',
                soilType: 'Clay',
                irrigationType: 'Flood',
              },
            ],
            requests: 2,
            income: 120000,
            estimatedIncome: 150000,
          },
          {
            _id: '2',
            name: 'Lakshmi Devi',
            mobileNo: '8765432109',
            village: 'Chandpur',
            landSize: '3 acres',
            crops: 'Cotton, Pulses',
            aadharNo: 'XXXX-XXXX-5678',
            registrationDate: '2023-02-20T09:45:00.000Z',
            lastVisitDate: '2023-05-28T14:30:00.000Z',
            fields: [
              {
                _id: 'f3',
                name: 'Main Field',
                size: '3 acres',
                crop: 'Cotton',
                soilType: 'Black',
                irrigationType: 'Sprinkler',
              },
            ],
            requests: 1,
            income: 85000,
            estimatedIncome: 100000,
          },
          {
            _id: '3',
            name: 'Suresh Patel',
            mobileNo: '7654321098',
            village: 'Rampur',
            landSize: '8 acres',
            crops: 'Wheat, Vegetables',
            aadharNo: 'XXXX-XXXX-9012',
            registrationDate: '2022-11-10T11:20:00.000Z',
            lastVisitDate: '2023-06-10T09:00:00.000Z',
            fields: [
              {
                _id: 'f4',
                name: 'East Field',
                size: '4 acres',
                crop: 'Wheat',
                soilType: 'Loamy',
                irrigationType: 'Tube Well',
              },
              {
                _id: 'f5',
                name: 'West Field',
                size: '4 acres',
                crop: 'Vegetables',
                soilType: 'Sandy Loam',
                irrigationType: 'Drip',
              },
            ],
            requests: 3,
            income: 200000,
            estimatedIncome: 220000,
          },
          {
            _id: '4',
            name: 'Meena Singh',
            mobileNo: '6543210987',
            village: 'Krishnapur',
            landSize: '2 acres',
            crops: 'Organic Vegetables',
            aadharNo: 'XXXX-XXXX-3456',
            registrationDate: '2023-03-05T10:30:00.000Z',
            lastVisitDate: '2023-06-02T11:45:00.000Z',
            fields: [
              {
                _id: 'f6',
                name: 'Organic Plot',
                size: '2 acres',
                crop: 'Mixed Vegetables',
                soilType: 'Rich Loam',
                irrigationType: 'Drip',
              },
            ],
            requests: 0,
            income: 75000,
            estimatedIncome: 90000,
          },
          {
            _id: '5',
            name: 'Arjun Reddy',
            mobileNo: '5432109876',
            village: 'Nandpur',
            landSize: '6 acres',
            crops: 'Tomatoes, Cucumbers',
            aadharNo: 'XXXX-XXXX-7890',
            registrationDate: '2023-01-25T13:15:00.000Z',
            lastVisitDate: '2023-05-20T16:30:00.000Z',
            fields: [
              {
                _id: 'f7',
                name: 'Vegetable Field 1',
                size: '3 acres',
                crop: 'Tomatoes',
                soilType: 'Red Soil',
                irrigationType: 'Drip',
              },
              {
                _id: 'f8',
                name: 'Vegetable Field 2',
                size: '3 acres',
                crop: 'Cucumbers',
                soilType: 'Red Soil',
                irrigationType: 'Drip',
              },
            ],
            requests: 1,
            income: 180000,
            estimatedIncome: 200000,
          },
        ]
        
        setFarmers(mockFarmers)
        
        // Extract unique villages for filter
        const uniqueVillages = [...new Set(mockFarmers.map(farmer => farmer.village))]
        setVillages(uniqueVillages)
        
        setLoading(false)
      }, 1000)
    }

    // Use mock data for demo
    simulateApiResponse()
    // In production, use the actual API call
    // fetchFarmers()
  }, [])

  const handleAddFarmer = async () => {
    // Validate form
    const errors = {}
    if (!newFarmer.name) errors.name = 'Name is required'
    if (!newFarmer.mobileNo) errors.mobileNo = 'Mobile number is required'
    if (!newFarmer.village) errors.village = 'Village is required'
    if (!newFarmer.landSize) errors.landSize = 'Land size is required'
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      setLoading(true)
      await axios.post('/api/executive/farmers', newFarmer)

      // Simulate API response for demo
      const newFarmerId = Math.random().toString(36).substring(2, 9)
      const addedFarmer = {
        _id: newFarmerId,
        ...newFarmer,
        registrationDate: new Date().toISOString(),
        lastVisitDate: new Date().toISOString(),
        fields: [],
        requests: 0,
        income: 0,
        estimatedIncome: 0,
      }

      setFarmers([...farmers, addedFarmer])
      setOpenAddDialog(false)
      setNewFarmer({
        name: '',
        mobileNo: '',
        village: '',
        landSize: '',
        crops: '',
        aadharNo: '',
      })
      setFormErrors({})
      setSnackbar({
        open: true,
        message: 'Farmer added successfully!',
        severity: 'success',
      })
    } catch (err) {
      console.error('Error adding farmer:', err)
      setSnackbar({
        open: true,
        message: 'Failed to add farmer. Please try again.',
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

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.mobileNo.includes(searchTerm) ||
                         farmer.village.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesVillage = filterVillage ? farmer.village === filterVillage : true
    
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
              onClick={() => setOpenAddDialog(true)}
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
              <TableCell>Land Size</TableCell>
              <TableCell>Crops</TableCell>
              <TableCell>Requests</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFarmers.length > 0 ? (
              filteredFarmers.map((farmer) => (
                <TableRow key={farmer._id}>
                  <TableCell>{farmer.name}</TableCell>
                  <TableCell>{farmer.mobileNo}</TableCell>
                  <TableCell>{farmer.village}</TableCell>
                  <TableCell>{farmer.landSize}</TableCell>
                  <TableCell>{farmer.crops}</TableCell>
                  <TableCell>
                    <Chip
                      label={farmer.requests}
                      color={farmer.requests > 0 ? 'primary' : 'default'}
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
                      <IconButton color="secondary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No farmers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Farmer Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Farmer</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
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
                label="Mobile Number"
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
                label="Village"
                name="village"
                value={newFarmer.village}
                onChange={handleInputChange}
                error={!!formErrors.village}
                helperText={formErrors.village}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Land Size (acres)"
                name="landSize"
                value={newFarmer.landSize}
                onChange={handleInputChange}
                error={!!formErrors.landSize}
                helperText={formErrors.landSize}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Crops"
                name="crops"
                value={newFarmer.crops}
                onChange={handleInputChange}
                placeholder="e.g. Rice, Wheat"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Aadhar Number"
                name="aadharNo"
                value={newFarmer.aadharNo}
                onChange={handleInputChange}
                placeholder="XXXX-XXXX-XXXX"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddFarmer}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Farmer'}
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
                          <Typography>{selectedFarmer.village}</Typography>
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
                          <strong>Land Size:</strong> {selectedFarmer.landSize}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Crops:</strong> {selectedFarmer.crops}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Aadhar:</strong> {selectedFarmer.aadharNo}
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
                              {new Date(selectedFarmer.registrationDate).toLocaleDateString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                              <strong>Last Visit Date:</strong>{' '}
                              {new Date(selectedFarmer.lastVisitDate).toLocaleDateString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {/* Fields Tab */}
              {tabValue === 1 && (
                <>
                  {selectedFarmer.fields && selectedFarmer.fields.length > 0 ? (
                    <Grid container spacing={2}>
                      {selectedFarmer.fields.map((field) => (
                        <Grid item xs={12} sm={6} key={field._id}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                {field.name}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Size:</strong> {field.size}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Crop:</strong> {field.crop}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Soil Type:</strong> {field.soilType}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Irrigation:</strong> {field.irrigationType}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography>No fields registered for this farmer.</Typography>
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
    </Box>
  )
}

export default FarmerManagement