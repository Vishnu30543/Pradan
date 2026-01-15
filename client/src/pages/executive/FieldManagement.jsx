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
  const [selectedStatus, setSelectedStatus] = useState('green')

  // Add Field State
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [newField, setNewField] = useState({
    farmerId: '',
    name: '',
    size: '',
    unit: 'acres',
    crop: '',
    soilType: '',
    irrigationType: '',
    address: ''
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

  const handleAddField = async () => {
    try {
      setLoading(true)
      const payload = {
        ...newField,
        irrigationSource: newField.irrigationType
      }

      const response = await axios.post('/api/executive/fields', payload)

      setFields([response.data.data, ...fields]) // Add new field to top
      setOpenAddDialog(false)
      setNewField({
        farmerId: '',
        name: '',
        size: '',
        unit: 'acres',
        crop: '',
        soilType: '',
        irrigationType: '',
        address: ''
      })
      setSnackbar({
        open: true,
        message: 'Field created successfully!',
        severity: 'success'
      })
    } catch (err) {
      console.error('Error creating field:', err)
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to create field',
        severity: 'error'
      })
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

  /*
  // For demo purposes, simulate API response with mock data
  useEffect(() => {
    const simulateApiResponse = () => {
      setTimeout(() => {
        // ... (mock data code) ...
        setLoading(false)
      }, 1000)
    }

    // Use mock data for demo
    // simulateApiResponse()
    // In production, use the actual API calls
    // fetchFields()
    // fetchFarmers()
  }, [])
  */

  const handleFileChange = (event) => {
    setUploadFiles(Array.from(event.target.files))
  }

  const handleUploadPhotos = async () => {
    if (uploadFiles.length === 0 || !selectedField) return

    try {
      setUploadLoading(true)

      const formData = new FormData()
      // Append each file to 'photos' field
      uploadFiles.forEach(file => {
        formData.append('photos', file)
      })
      // Append farmerId as required by the backend controller
      formData.append('farmerId', selectedField.farmer._id)
      // Append fieldId
      formData.append('fieldId', selectedField._id)

      if (selectedStatus) {
        formData.append('healthStatus', selectedStatus)
      }

      // Send to backend
      const response = await axios.post('/api/executive/field-photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        // Update the fields state with new photos from response
        const newPhotos = response.data.photos || []

        const updatedFields = fields.map(field => {
          if (field._id === selectedField._id) {
            return {
              ...field,
              photos: [...(field.photos || []), ...newPhotos],
              lastUpdated: new Date().toISOString(),
              history: [
                {
                  date: new Date().toISOString(),
                  action: 'Photo upload',
                  notes: `Uploaded ${newPhotos.length} new photos`,
                },
                ...(field.history || []),
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
        setSnackbar({
          open: true,
          message: `Successfully uploaded ${newPhotos.length} photos`,
          severity: 'success',
        })
      }
      setUploadLoading(false)
    } catch (err) {
      console.error('Error uploading photos:', err)
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to upload photos. Please try again.',
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
              onClick={() => setOpenAddDialog(true)}
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
                  image={field.photos && field.photos.length > 0 ? (field.photos[0].photoUrl || field.photos[0].url) : 'https://via.placeholder.com/300x140?text=No+Image'}
                  alt={field.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {field.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {field.farmer?.name || 'Unknown Farmer'}
                    </Typography>
                    <Chip
                      label={typeof field.crop === 'object' ? field.crop.current : field.crop || 'Unknown'}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Size:</strong> {typeof field.size === 'object' ? `${field.size.value} ${field.size.unit}` : field.size}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Soil:</strong> {field.soilType || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Irrigation:</strong> {field.irrigationSource || field.irrigationType || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Plants:</strong> {(field.plantCount || 0).toLocaleString()}
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
                      setSelectedStatus('green')
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
                  label={typeof selectedField.crop === 'object' ? selectedField.crop.current : selectedField.crop}
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
                          {selectedField.farmer?.name || 'Unknown Farmer'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedField.location?.village || selectedField.farmer?.village || 'Unknown Location'}
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
                              <strong>Size:</strong> {typeof selectedField.size === 'object' ? `${selectedField.size.value} ${selectedField.size.unit}` : selectedField.size}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Crop:</strong> {typeof selectedField.crop === 'object' ? selectedField.crop.current : selectedField.crop}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Soil Type:</strong> {selectedField.soilType || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Irrigation:</strong> {selectedField.irrigationSource || selectedField.irrigationType || 'N/A'}
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
                              <strong>Plant Count:</strong> {(selectedField.plantCount || 0).toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Est. Yield:</strong> {selectedField.estimatedYield || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2">
                              <strong>Last Updated:</strong>{' '}
                              {new Date(selectedField.updatedAt || selectedField.lastUpdated || Date.now()).toLocaleDateString()}
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
                              src={selectedField.photos[0].photoUrl || selectedField.photos[0].url}
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
                              image={photo.photoUrl || photo.url}
                              alt={photo.description || 'Field photo'}
                            />
                            <CardContent>
                              <Typography variant="body2">
                                {photo.description}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Uploaded: {new Date(photo.createdAt || photo.uploadDate || Date.now()).toLocaleDateString()}
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
                        onClick={() => { setSelectedStatus('green'); setOpenUploadDialog(true) }}
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
                onClick={() => { setSelectedStatus('green'); setOpenUploadDialog(true) }}
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
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Field Health Status</InputLabel>
                  <Select
                    value={selectedStatus}
                    label="Field Health Status"
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <MenuItem value="green">Healthy (Green)</MenuItem>
                    <MenuItem value="yellow">Needs Attention (Yellow)</MenuItem>
                    <MenuItem value="red">Critical (Red)</MenuItem>
                  </Select>
                </FormControl>

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

      {/* Add Field Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Field</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Farmer</InputLabel>
                <Select
                  value={newField.farmerId}
                  label="Select Farmer"
                  onChange={(e) => setNewField({ ...newField, farmerId: e.target.value })}
                >
                  {farmers.map((farmer) => (
                    <MenuItem key={farmer._id} value={farmer._id}>
                      {farmer.name} ({farmer.village})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Field Name"
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Size"
                type="number"
                value={newField.size}
                onChange={(e) => setNewField({ ...newField, size: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={newField.unit}
                  label="Unit"
                  onChange={(e) => setNewField({ ...newField, unit: e.target.value })}
                >
                  <MenuItem value="acres">Acres</MenuItem>
                  <MenuItem value="hectares">Hectares</MenuItem>
                  <MenuItem value="bigha">Bigha</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address/Location"
                value={newField.address}
                onChange={(e) => setNewField({ ...newField, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Crop"
                value={newField.crop}
                onChange={(e) => setNewField({ ...newField, crop: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Soil Type</InputLabel>
                <Select
                  value={newField.soilType}
                  label="Soil Type"
                  onChange={(e) => setNewField({ ...newField, soilType: e.target.value })}
                >
                  <MenuItem value="clay">Clay</MenuItem>
                  <MenuItem value="sandy">Sandy</MenuItem>
                  <MenuItem value="loamy">Loamy</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Irrigation Source</InputLabel>
                <Select
                  value={newField.irrigationType}
                  label="Irrigation Source"
                  onChange={(e) => setNewField({ ...newField, irrigationType: e.target.value })}
                >
                  <MenuItem value="rainfed">Rainfed</MenuItem>
                  <MenuItem value="canal">Canal</MenuItem>
                  <MenuItem value="well">Well</MenuItem>
                  <MenuItem value="borewell">Borewell</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddField}
            variant="contained"
            disabled={!newField.farmerId || !newField.name || !newField.size || !newField.address}
          >
            Create Field
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