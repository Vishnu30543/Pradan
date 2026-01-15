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
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
} from '@mui/icons-material'
import axios from 'axios'

const FarmerOverview = () => {
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [selectedFarmer, setSelectedFarmer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRegion, setFilterRegion] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  useEffect(() => {
    fetchFarmers()
  }, [])

  const fetchFarmers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/admin/farmers')
      setFarmers(response.data.farmers)
      setError(null)
    } catch (err) {
      console.error('Error fetching farmers:', err)
      setError('Failed to load farmers. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // For demo purposes, simulate API response with mock data
  // For demo purposes, simulate API response with mock data
  /*
  useEffect(() => {
    const simulateApiResponse = () => {
      setTimeout(() => {
        setFarmers([
          {
            _id: '1',
            name: 'Rajesh Kumar',
            fatherHusbandName: 'Mahesh Kumar',
            mobileNo: '9876543210',
            email: 'rajesh.kumar@example.com',
            village: 'Sundarpur',
            panchayat: 'Sundarpur Gram',
            caste: 'General',
            womenFarmer: false,
            group: 'Group A',
            creditScore: 750,
            income: 120000,
            estimatedIncome: 150000,
            crops: ['Rice', 'Wheat'],
            assignedExecutive: {
              _id: '1',
              name: 'John Doe',
              region: 'North',
            },
            createdAt: '2023-01-10T08:30:00.000Z',
            fieldStatus: {
              health: 'green',
              lastUpdated: '2023-06-15T14:20:00.000Z',
            },
          },
          {
            _id: '2',
            name: 'Lakshmi Devi',
            fatherHusbandName: 'Ramesh Devi',
            mobileNo: '8765432109',
            email: 'lakshmi.devi@example.com',
            village: 'Chandpur',
            panchayat: 'Chandpur Gram',
            caste: 'OBC',
            womenFarmer: true,
            group: 'Group B',
            creditScore: 680,
            income: 90000,
            estimatedIncome: 110000,
            crops: ['Cotton', 'Pulses'],
            assignedExecutive: {
              _id: '2',
              name: 'Jane Smith',
              region: 'South',
            },
            createdAt: '2023-02-15T10:45:00.000Z',
            fieldStatus: {
              health: 'yellow',
              lastUpdated: '2023-06-10T11:30:00.000Z',
            },
          },
          {
            _id: '3',
            name: 'Suresh Patel',
            fatherHusbandName: 'Dinesh Patel',
            mobileNo: '7654321098',
            email: 'suresh.patel@example.com',
            village: 'Rampur',
            panchayat: 'Rampur Gram',
            caste: 'SC',
            womenFarmer: false,
            group: 'Group C',
            creditScore: 720,
            income: 105000,
            estimatedIncome: 130000,
            crops: ['Sugarcane', 'Maize'],
            assignedExecutive: {
              _id: '3',
              name: 'Robert Johnson',
              region: 'East',
              },
            createdAt: '2023-03-20T09:15:00.000Z',
            fieldStatus: {
              health: 'red',
              lastUpdated: '2023-06-05T16:45:00.000Z',
            },
          },
          {
            _id: '4',
            name: 'Meena Singh',
            fatherHusbandName: 'Rakesh Singh',
            mobileNo: '6543210987',
            email: 'meena.singh@example.com',
            village: 'Krishnapur',
            panchayat: 'Krishnapur Gram',
            caste: 'ST',
            womenFarmer: true,
            group: 'Group A',
            creditScore: 690,
            income: 85000,
            estimatedIncome: 100000,
            crops: ['Vegetables', 'Fruits'],
            assignedExecutive: {
              _id: '4',
              name: 'Emily Davis',
              region: 'West',
            },
            createdAt: '2023-04-05T11:20:00.000Z',
            fieldStatus: {
              health: 'green',
              lastUpdated: '2023-06-12T09:10:00.000Z',
            },
          },
          {
            _id: '5',
            name: 'Arjun Reddy',
            fatherHusbandName: 'Venkat Reddy',
            mobileNo: '5432109876',
            email: 'arjun.reddy@example.com',
            village: 'Nandpur',
            panchayat: 'Nandpur Gram',
            caste: 'General',
            womenFarmer: false,
            group: 'Group B',
            creditScore: 760,
            income: 130000,
            estimatedIncome: 160000,
            crops: ['Rice', 'Pulses', 'Oilseeds'],
            assignedExecutive: {
              _id: '5',
              name: 'Michael Wilson',
              region: 'Central',
            },
            createdAt: '2023-05-18T16:30:00.000Z',
            fieldStatus: {
              health: 'yellow',
              lastUpdated: '2023-06-08T14:25:00.000Z',
            },
          },
        ])
        setLoading(false)
      }, 1000)
    }

    // Use mock data for demo
    simulateApiResponse()
    // In production, use the actual API call
    // fetchFarmers()
  }, [])
  */

  const handleDeleteFarmer = async () => {
    if (!selectedFarmer) return

    try {
      setLoading(true)
      await axios.delete(`/api/admin/farmer/${selectedFarmer._id}`)

      // Update the local state by filtering out the deleted farmer
      setFarmers(farmers.filter(farmer => farmer._id !== selectedFarmer._id))
      setOpenDeleteDialog(false)
      setSelectedFarmer(null)
      setSnackbar({
        open: true,
        message: 'Farmer deleted successfully!',
        severity: 'success',
      })
    } catch (err) {
      console.error('Error deleting farmer:', err)
      setSnackbar({
        open: true,
        message: 'Failed to delete farmer. Please try again.',
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    try {
      const response = await axios.post('/api/admin/farmer-report', {}, { responseType: 'blob' })

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `farmers-report-${new Date().toISOString().split('T')[0]}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error('Error generating report:', err)
      setSnackbar({
        open: true,
        message: 'Failed to generate report. Please try again.',
        severity: 'error',
      })
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Filter farmers based on search term, region, and tab value
  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.mobileNo?.includes(searchTerm) ||
      farmer.village?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRegion = filterRegion
      ? farmer.assignedExecutive?.region === filterRegion
      : true

    const matchesTab =
      (tabValue === 0) || // All
      (tabValue === 1 && (farmer.fieldStatus?.healthStatus === 'green' || farmer.fieldStatus?.health === 'green')) || // Healthy
      (tabValue === 2 && (farmer.fieldStatus?.healthStatus === 'yellow' || farmer.fieldStatus?.health === 'yellow')) || // Warning
      (tabValue === 3 && (farmer.fieldStatus?.healthStatus === 'red' || farmer.fieldStatus?.health === 'red')) || // Critical
      (tabValue === 4 && farmer.womenFarmer) // Women Farmers

    return matchesSearch && matchesRegion && matchesTab
  })

  // Get unique regions for filter
  const regions = [...new Set(farmers.map((farmer) => farmer.assignedExecutive?.region).filter(Boolean))]

  // Calculate statistics
  const totalFarmers = farmers.length
  const womenFarmers = farmers.filter((farmer) => farmer.womenFarmer).length
  const healthyFields = farmers.filter((farmer) => farmer.fieldStatus?.healthStatus === 'green' || farmer.fieldStatus?.health === 'green').length
  const warningFields = farmers.filter((farmer) => farmer.fieldStatus?.healthStatus === 'yellow' || farmer.fieldStatus?.health === 'yellow').length
  const criticalFields = farmers.filter((farmer) => farmer.fieldStatus?.healthStatus === 'red' || farmer.fieldStatus?.health === 'red').length
  const averageIncome = farmers.length > 0
    ? Math.round(farmers.reduce((sum, farmer) => sum + farmer.income, 0) / farmers.length)
    : 0

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

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Farmer Overview
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleGenerateReport}
        >
          Generate Report
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Farmers
              </Typography>
              <Typography variant="h3">{totalFarmers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Women Farmers
              </Typography>
              <Typography variant="h3">{womenFarmers}</Typography>
              <Typography variant="body2" color="text.secondary">
                {totalFarmers > 0 ? Math.round((womenFarmers / totalFarmers) * 100) : 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Healthy Fields
              </Typography>
              <Typography variant="h3">{healthyFields}</Typography>
              <Typography variant="body2">
                {totalFarmers > 0 ? Math.round((healthyFields / totalFarmers) * 100) : 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: 'warning.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Warning Fields
              </Typography>
              <Typography variant="h3">{warningFields}</Typography>
              <Typography variant="body2">
                {totalFarmers > 0 ? Math.round((warningFields / totalFarmers) * 100) : 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ bgcolor: 'error.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Critical Fields
              </Typography>
              <Typography variant="h3">{criticalFields}</Typography>
              <Typography variant="body2">
                {totalFarmers > 0 ? Math.round((criticalFields / totalFarmers) * 100) : 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Avg. Income
              </Typography>
              <Typography variant="h3">₹{averageIncome.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name, mobile, or village"
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
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="region-filter-label">Filter by Region</InputLabel>
            <Select
              labelId="region-filter-label"
              id="region-filter"
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              label="Filter by Region"
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="">All Regions</MenuItem>
              {regions.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="farmer status tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Farmers" />
          <Tab
            label={`Healthy Fields (${healthyFields})`}
            icon={<Chip size="small" sx={{ bgcolor: 'success.main', width: 16, height: 16 }} />}
            iconPosition="start"
          />
          <Tab
            label={`Warning Fields (${warningFields})`}
            icon={<Chip size="small" sx={{ bgcolor: 'warning.main', width: 16, height: 16 }} />}
            iconPosition="start"
          />
          <Tab
            label={`Critical Fields (${criticalFields})`}
            icon={<Chip size="small" sx={{ bgcolor: 'error.main', width: 16, height: 16 }} />}
            iconPosition="start"
          />
          <Tab label={`Women Farmers (${womenFarmers})`} />
        </Tabs>
      </Box>

      {/* Farmers Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="farmers table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Village</TableCell>
                <TableCell>Crops</TableCell>
                <TableCell>Field Status</TableCell>
                <TableCell>Income</TableCell>
                <TableCell>Executive</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFarmers.length > 0 ? (
                filteredFarmers.map((farmer) => {
                  const healthStatus = (typeof farmer.fieldStatus === 'string' ? farmer.fieldStatus : (farmer.fieldStatus?.healthStatus || farmer.fieldStatus?.health)) || 'unknown';
                  const crops = farmer.crops || farmer.plants || [];

                  return (
                    <TableRow key={farmer._id}>
                      <TableCell>
                        {farmer.name}
                        {farmer.womenFarmer && (
                          <Chip
                            label="W"
                            size="small"
                            color="secondary"
                            sx={{ ml: 1, height: 20, width: 20 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{farmer.mobileNo}</TableCell>
                      <TableCell>{farmer.village}</TableCell>
                      <TableCell>
                        {crops.map((crop) => (
                          <Chip
                            key={crop}
                            label={crop}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={healthStatus.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor:
                              healthStatus === 'green' || healthStatus === 'healthy'
                                ? 'success.main'
                                : healthStatus === 'yellow' || healthStatus === 'moderate'
                                  ? 'warning.main'
                                  : healthStatus === 'red' || healthStatus === 'critical'
                                    ? 'error.main'
                                    : 'grey.500',
                            color: 'white',
                          }}
                        />
                      </TableCell>
                      <TableCell>₹{(farmer.income || 0).toLocaleString()}</TableCell>
                      <TableCell>{farmer.assignedExecutive?.name || 'Unassigned'}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelectedFarmer({ ...farmer, safeCrops: crops, safeHealth: healthStatus }) // Pass safe values
                            setOpenViewDialog(true)
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setSelectedFarmer(farmer)
                            setOpenDeleteDialog(true)
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No farmers found matching the criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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
              Farmer Details
              {selectedFarmer.womenFarmer && (
                <Chip
                  label="Women Farmer"
                  size="small"
                  color="secondary"
                  sx={{ ml: 2 }}
                />
              )}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">{selectedFarmer.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Father/Husband: {selectedFarmer.fatherHusbandName}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
                  <Chip
                    label={`Field Status: ${(selectedFarmer.safeHealth || 'unknown').toUpperCase()}`}
                    sx={{
                      bgcolor:
                        selectedFarmer.safeHealth === 'green' || selectedFarmer.safeHealth === 'healthy'
                          ? 'success.main'
                          : selectedFarmer.safeHealth === 'yellow' || selectedFarmer.safeHealth === 'moderate'
                            ? 'warning.main'
                            : 'error.main',
                      color: 'white',
                    }}
                  />
                  {typeof selectedFarmer.fieldStatus === 'object' && selectedFarmer.fieldStatus?.lastUpdated && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Last Updated: {new Date(selectedFarmer.fieldStatus.lastUpdated).toLocaleDateString()}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2">Contact Information</Typography>
                  <Typography variant="body2">Mobile: {selectedFarmer.mobileNo}</Typography>
                  <Typography variant="body2">Email: {selectedFarmer.email}</Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2">Location</Typography>
                  <Typography variant="body2">Village: {selectedFarmer.village}</Typography>
                  <Typography variant="body2">Panchayat: {selectedFarmer.panchayat}</Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2">Demographics</Typography>
                  <Typography variant="body2">Caste: {selectedFarmer.caste}</Typography>
                  <Typography variant="body2">Group: {selectedFarmer.group}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2">Financial Information</Typography>
                  <Typography variant="body2">Credit Score: {selectedFarmer.creditScore}</Typography>
                  <Typography variant="body2">Current Income: ₹{(selectedFarmer.income || 0).toLocaleString()}</Typography>
                  <Typography variant="body2">Estimated Income: ₹{(selectedFarmer.estimatedIncome || 0).toLocaleString()}</Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2">Crops</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {(selectedFarmer.safeCrops || []).map((crop) => (
                      <Chip key={crop} label={crop} size="small" />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2">Executive Information</Typography>
                  <Typography variant="body2">Name: {selectedFarmer.assignedExecutive?.name || 'Unassigned'}</Typography>
                  <Typography variant="body2">Region: {selectedFarmer.assignedExecutive?.region || 'N/A'}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Registered on: {new Date(selectedFarmer.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Farmer Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete farmer {selectedFarmer?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteFarmer}
            color="error"
            variant="contained"
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
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

export default FarmerOverview