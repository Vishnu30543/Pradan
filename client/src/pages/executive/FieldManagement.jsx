import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Chip,
  IconButton,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
} from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  PhotoCamera as PhotoCameraIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  History as HistoryIcon,
  Grass as GrassIcon,
  Water as WaterIcon,
  Terrain as TerrainIcon,
  CalendarMonth as CalendarMonthIcon,
  Image as ImageIcon,
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const FieldManagement = () => {
  const { user } = useAuth()
  const [fields, setFields] = useState([])
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterFarmer, setFilterFarmer] = useState('')
  const [filterCrop, setFilterCrop] = useState('')
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [openUploadDialog, setOpenUploadDialog] = useState(false)
  const [selectedField, setSelectedField] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [uploadFiles, setUploadFiles] = useState([])
  const [uploadLoading, setUploadLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  useEffect(() => {
    fetchFields()
    fetchFarmers()
  }, [])

  const fetchFields = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/executive/fields')
      setFields(response.data.fields)
      setError(null)
    } catch (err) {
      console.error('Error fetching fields:', err)
      setError('Failed to load fields. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const fetchFarmers = async () => {
    try {
      const response = await axios.get('/api/executive/farmers')
      setFarmers(response.data.farmers)
    } catch (err) {
      console.error('Error fetching farmers:', err)
    }
  }

  // For demo purposes, simulate API response with mock data
  useEffect(() => {
    const simulateApiResponse = () => {
      setTimeout(() => {
        const mockFarmers = [
          { _id: '1', name: 'Rajesh Kumar', village: 'Sundarpur' },
          { _id: '2', name: 'Lakshmi Devi', village: 'Chandpur' },
          { _id: '3', name: 'Suresh Patel', village: 'Rampur' },
          { _id: '4', name: 'Meena Singh', village: 'Krishnapur' },
          { _id: '5', name: 'Arjun Reddy', village: 'Nandpur' },
        ]

        const mockFields = [
          {
            _id: 'f1',
            name: 'North Field',
            size: '3 acres',
            crop: 'Rice',
            soilType: 'Loamy',
            irrigationType: 'Drip',
            farmer: {
              _id: '1',
              name: 'Rajesh Kumar',
              village: 'Sundarpur',
            },
            lastUpdated: '2023-06-05T10:15:00.000Z',
            plantCount: 1500,
            estimatedYield: '12 quintals',
            photos: [
              {
                _id: 'p1',
                url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmljZSUyMGZpZWxkfGVufDB8fDB8fHww&w=1000&q=80',
                uploadDate: '2023-06-01T09:30:00.000Z',
                description: 'Rice field after irrigation',
              },
              {
                _id: 'p2',
                url: 'https://images.unsplash.com/photo-1559060017-445fb9722f2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmljZSUyMGZpZWxkfGVufDB8fDB8fHww&w=1000&q=80',
                uploadDate: '2023-05-15T14:20:00.000Z',
                description: 'Initial growth stage',
              },
            ],
            history: [
              {
                date: '2023-06-05T10:15:00.000Z',
                action: 'Field inspection',
                notes: 'Crop growing well, no pest issues',
              },
              {
                date: '2023-05-20T11:30:00.000Z',
                action: 'Fertilizer application',
                notes: 'Applied NPK fertilizer',
              },
              {
                date: '2023-05-01T09:00:00.000Z',
                action: 'Planting',
                notes: 'Rice planting completed',
              },
            ],
          },
          {
            _id: 'f2',
            name: 'South Field',
            size: '2 acres',
            crop: 'Wheat',
            soilType: 'Clay',
            irrigationType: 'Flood',
            farmer: {
              _id: '1',
              name: 'Rajesh Kumar',
              village: 'Sundarpur',
            },
            lastUpdated: '2023-06-02T14:30:00.000Z',
            plantCount: 1000,
            estimatedYield: '8 quintals',
            photos: [
              {
                _id: 'p3',
                url: 'https://images.unsplash.com/photo-1536054695485-8b1bd7a7c603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2hlYXQlMjBmaWVsZHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
                uploadDate: '2023-06-02T14:30:00.000Z',
                description: 'Wheat field ready for harvest',
              },
            ],
            history: [
              {
                date: '2023-06-02T14:30:00.000Z',
                action: 'Pre-harvest inspection',
                notes: 'Crop ready for harvest in 2 weeks',
              },
              {
                date: '2023-04-15T10:00:00.000Z',
                action: 'Pest control',
                notes: 'Applied organic pesticide',
              },
            ],
          },
          {
            _id: 'f3',
            name: 'Main Field',
            size: '3 acres',
            crop: 'Cotton',
            soilType: 'Black',
            irrigationType: 'Sprinkler',
            farmer: {
              _id: '2',
              name: 'Lakshmi Devi',
              village: 'Chandpur',
            },
            lastUpdated: '2023-05-28T14:30:00.000Z',
            plantCount: 900,
            estimatedYield: '5 quintals',
            photos: [
              {
                _id: 'p4',
                url: 'https://images.unsplash.com/photo-1599824701954-d1d3d473f782?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y290dG9uJTIwZmllbGR8ZW58MHx8MHx8fDA%3D&w=1000&q=80',
                uploadDate: '2023-05-28T14:30:00.000Z',
                description: 'Cotton field flowering stage',
              },
            ],
            history: [
              {
                date: '2023-05-28T14:30:00.000Z',
                action: 'Field inspection',
                notes: 'Good flowering, applied additional fertilizer',
              },
              {
                date: '2023-04-10T09:30:00.000Z',
                action: 'Planting',
                notes: 'Cotton planting completed',
              },
            ],
          },
          {
            _id: 'f4',
            name: 'East Field',
            size: '4 acres',
            crop: 'Wheat',
            soilType: 'Loamy',
            irrigationType: 'Tube Well',
            farmer: {
              _id: '3',
              name: 'Suresh Patel',
              village: 'Rampur',
            },
            lastUpdated: '2023-06-10T09:00:00.000Z',
            plantCount: 2000,
            estimatedYield: '16 quintals',
            photos: [
              {
                _id: 'p5',
                url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2hlYXQlMjBmaWVsZHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
                uploadDate: '2023-06-10T09:00:00.000Z',
                description: 'Wheat field with good growth',
              },
            ],
            history: [
              {
                date: '2023-06-10T09:00:00.000Z',
                action: 'Field inspection',
                notes: 'Crop in excellent condition',
              },
              {
                date: '2023-05-05T11:00:00.000Z',
                action: 'Fertilizer application',
                notes: 'Applied urea',
              },
              {
                date: '2023-04-01T08:30:00.000Z',
                action: 'Planting',
                notes: 'Wheat planting completed',
              },
            ],
          },
          {
            _id: 'f5',
            name: 'West Field',
            size: '4 acres',
            crop: 'Vegetables',
            soilType: 'Sandy Loam',
            irrigationType: 'Drip',
            farmer: {
              _id: '3',
              name: 'Suresh Patel',
              village: 'Rampur',
            },
            lastUpdated: '2023-06-08T10:30:00.000Z',
            plantCount: 3000,
            estimatedYield: '20 quintals',
            photos: [
              {
                _id: 'p6',
                url: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnZXRhYmxlJTIwZmllbGR8ZW58MHx8MHx8fDA%3D&w=1000&q=80',
                uploadDate: '2023-06-08T10:30:00.000Z',
                description: 'Mixed vegetable field',
              },
            ],
            history: [
              {
                date: '2023-06-08T10:30:00.000Z',
                action: 'Field inspection',
                notes: 'Vegetables growing well, harvesting started for some crops',
              },
              {
                date: '2023-05-10T09:00:00.000Z',
                action: 'Pest control',
                notes: 'Applied neem-based pesticide',
              },
              {
                date: '2023-04-15T08:00:00.000Z',
                action: 'Planting',
                notes: 'Mixed vegetable planting completed',
              },
            ],
          },
        ]

        setFarmers(mockFarmers)
        setFields(mockFields)
        setLoading(false)
      }, 1000)
    }

    // Use mock data for demo
    simulateApiResponse()
    // In production, use the actual API calls
    // fetchFields()
    // fetchFarmers()
  }, [])

  const handleFileChange = (event) => {
    setUploadFiles(Array.from(event.target.files))
  }

  const handleUploadPhotos = async () => {
    if (uploadFiles.length === 0 || !selectedField) return

    try {
      setUploadLoading(true)
      
      // In a real app, you would create a FormData object and send the files
      // const formData = new FormData()
      // uploadFiles.forEach(file => formData.append('photos', file))
      // await axios.post(`/api/executive/fields/${selectedField._id}/photos`, formData)

      // Simulate API response for demo
      setTimeout(() => {
        // Create mock photo objects
        const newPhotos = uploadFiles.map((file, index) => ({
          _id: `new-photo-${Date.now()}-${index}`,
          url: URL.createObjectURL(file), // This creates a temporary URL for preview
          uploadDate: new Date().toISOString(),
          description: `New photo uploaded on ${new Date().toLocaleDateString()}`,
        }))

        // Update the fields state with new photos
        const updatedFields = fields.map(field => {
          if (field._id === selectedField._id) {
            return {
              ...field,
              photos: [...field.photos, ...newPhotos],
              lastUpdated: new Date().toISOString(),
              history: [
                {
                  date: new Date().toISOString(),
                  action: 'Photo upload',
                  notes: `Uploaded ${uploadFiles.length} new photos`,
                },
                ...field.history,
              ],
            }
          }
          return field
        })

        // Update the selected field for the dialog
        const updatedField = updatedFields.find(field => field._id === selectedField._id)

        setFields(updatedFields)
        setSelectedField(updatedField)
        setUploadFiles([])
        setOpenUploadDialog(false)
        setUploadLoading(false)
        setSnackbar({
          open: true,
          message: `Successfully uploaded ${newPhotos.length} photos`,
          severity: 'success',
        })
      }, 1500)
    } catch (err) {
      console.error('Error uploading photos:', err)
      setSnackbar({
        open: true,
        message: 'Failed to upload photos. Please try again.',
        severity: 'error',
      })
      setUploadLoading(false)
    }
  }

  const handleViewField = (field) => {
    setSelectedField(field)
    setOpenViewDialog(true)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  // Get unique crop types for filter
  const cropTypes = [...new Set(fields.map(field => field.crop))]

  // Filter fields based on search term and filters
  const filteredFields = fields.filter(field => {
    const matchesSearch = 
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.crop.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFarmer = filterFarmer ? field.farmer._id === filterFarmer : true
    const matchesCrop = filterCrop ? field.crop === filterCrop : true
    
    return matchesSearch && matchesFarmer && matchesCrop
  })

  if (loading && fields.length === 0) {
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
        Field Management
      </Typography>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search Fields"
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
              <InputLabel>Filter by Farmer</InputLabel>
              <Select
                value={filterFarmer}
                onChange={(e) => setFilterFarmer(e.target.value)}
                label="Filter by Farmer"
              >
                <MenuItem value="">
                  <em>All Farmers</em>
                </MenuItem>
                {farmers.map((farmer) => (
                  <MenuItem key={farmer._id} value={farmer._id}>
                    {farmer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Filter by Crop</InputLabel>
              <Select
                value={filterCrop}
                onChange={(e) => setFilterCrop(e.target.value)}
                label="Filter by Crop"
              >
                <MenuItem value="">
                  <em>All Crops</em>
                </MenuItem>
                {cropTypes.map((crop) => (
                  <MenuItem key={crop} value={crop}>
                    {crop}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              disabled
            >
              Add Field
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Fields Grid */}
      <Grid container spacing={3}>
        {filteredFields.length > 0 ? (
          filteredFields.map((field) => (
            <Grid item xs={12} sm={6} md={4} key={field._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={field.photos && field.photos.length > 0 ? field.photos[0].url : 'https://via.placeholder.com/300x140?text=No+Image'}
                  alt={field.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {field.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {field.farmer.name}
                    </Typography>
                    <Chip
                      label={field.crop}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Size:</strong> {field.size}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Soil:</strong> {field.soilType}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Irrigation:</strong> {field.irrigationType}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Plants:</strong> {field.plantCount.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewField(field)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    startIcon={<PhotoCameraIcon />}
                    onClick={() => {
                      setSelectedField(field)
                      setOpenUploadDialog(true)
                    }}
                  >
                    Upload Photos
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography>No fields found matching your criteria.</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* View Field Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedField && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedField.name}</Typography>
                <Chip
                  label={selectedField.crop}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Details" />
                <Tab label="Photos" />
                <Tab label="History" />
              </Tabs>

              {/* Details Tab */}
              {tabValue === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Farmer Information
                        </Typography>
                        <Typography variant="body1">
                          {selectedField.farmer.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedField.farmer.village}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Field Information
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Size:</strong> {selectedField.size}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Crop:</strong> {selectedField.crop}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Soil Type:</strong> {selectedField.soilType}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Irrigation:</strong> {selectedField.irrigationType}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Crop Information
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Plant Count:</strong> {selectedField.plantCount.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Est. Yield:</strong> {selectedField.estimatedYield}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2">
                              <strong>Last Updated:</strong>{' '}
                              {new Date(selectedField.lastUpdated).toLocaleDateString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Latest Photo
                        </Typography>
                        {selectedField.photos && selectedField.photos.length > 0 ? (
                          <Box sx={{ position: 'relative' }}>
                            <img
                              src={selectedField.photos[0].url}
                              alt="Latest field photo"
                              style={{ width: '100%', borderRadius: '4px' }}
                            />
                            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                              {selectedField.photos[0].description}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography>No photos available</Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {/* Photos Tab */}
              {tabValue === 1 && (
                <>
                  {selectedField.photos && selectedField.photos.length > 0 ? (
                    <Grid container spacing={2}>
                      {selectedField.photos.map((photo) => (
                        <Grid item xs={12} sm={6} md={4} key={photo._id}>
                          <Card>
                            <CardMedia
                              component="img"
                              height="200"
                              image={photo.url}
                              alt={photo.description || 'Field photo'}
                            />
                            <CardContent>
                              <Typography variant="body2">
                                {photo.description}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Uploaded: {new Date(photo.uploadDate).toLocaleDateString()}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <ImageIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                        No Photos Available
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mt: 2 }}
                        onClick={() => setOpenUploadDialog(true)}
                      >
                        Upload Photos
                      </Button>
                    </Box>
                  )}
                </>
              )}

              {/* History Tab */}
              {tabValue === 2 && (
                <List>
                  {selectedField.history && selectedField.history.length > 0 ? (
                    selectedField.history.map((item, index) => (
                      <ListItem key={index} divider={index < selectedField.history.length - 1}>
                        <ListItemIcon>
                          <HistoryIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.action}
                          secondary={
                            <>
                              <Typography variant="body2">{item.notes}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(item.date).toLocaleDateString()}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="No history records available" />
                    </ListItem>
                  )}
                </List>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                startIcon={<CloudUploadIcon />}
                variant="outlined"
                color="primary"
                onClick={() => setOpenUploadDialog(true)}
              >
                Upload Photos
              </Button>
              <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Upload Photos Dialog */}
      <Dialog
        open={openUploadDialog}
        onClose={() => !uploadLoading && setOpenUploadDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Field Photos</DialogTitle>
        <DialogContent>
          {selectedField && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                {selectedField.name} - {selectedField.farmer.name}
              </Typography>
              <Box sx={{ my: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ py: 1.5 }}
                  disabled={uploadLoading}
                >
                  Select Photos
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>
              {uploadFiles.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Files ({uploadFiles.length}):
                  </Typography>
                  <List dense>
                    {uploadFiles.map((file, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <ImageIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024).toFixed(2)} KB`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenUploadDialog(false)}
            disabled={uploadLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUploadPhotos}
            variant="contained"
            disabled={uploadFiles.length === 0 || uploadLoading}
            startIcon={uploadLoading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          >
            {uploadLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
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

export default FieldManagement