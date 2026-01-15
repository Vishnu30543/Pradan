import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Avatar,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarMonthIcon,
  Agriculture as AgricultureIcon,
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editedProfile, setEditedProfile] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState(null)
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false)
  const [fieldPhotos, setFieldPhotos] = useState([])
  const [fields, setFields] = useState([])
  const [derivedStats, setDerivedStats] = useState({ totalArea: 0, fieldCrops: [], allPhotos: [] })
  const [newFieldPhotos, setNewFieldPhotos] = useState([])
  const [newFieldPhotosPreviews, setNewFieldPhotosPreviews] = useState([])
  const [tabValue, setTabValue] = useState(0)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })
  const [selectedStatus, setSelectedStatus] = useState('green')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)

      const [profileRes, fieldsRes] = await Promise.all([
        axios.get('/api/farmer/profile'),
        axios.get('/api/farmer/fields')
      ])

      const profileData = profileRes.data.farmer
      const fieldsData = fieldsRes.data.fields || []

      setProfile(profileData)

      const flatProfile = { ...profileData }
      if (typeof flatProfile.landSize === 'object') flatProfile.landSize = flatProfile.landSize?.value
      setEditedProfile(flatProfile)
      setFields(fieldsData)

      // Calculate stats
      const totalArea = fieldsData.reduce((sum, field) => {
        const sizeVal = typeof field.size === 'object' ? field.size?.value : field.size;
        return sum + (Number(sizeVal) || 0);
      }, 0)
      const uniqueCrops = [...new Set(fieldsData.map(f => {
        if (!f.crop) return null;
        if (typeof f.crop === 'string') return f.crop;
        if (typeof f.crop === 'object') return f.crop.current || f.crop.name || JSON.stringify(f.crop); // Handle {current: ...} or other objects
        return String(f.crop);
      }).filter(Boolean))]

      // Combine photos: Profile Photos + Field Photos
      const profilePhotos = profileData.fieldPhotos || []
      const fieldSpecificPhotos = fieldsData.flatMap(f => (f.photos || []).map(p => ({ ...p, fieldName: f.name })))
      const allPhotos = [...profilePhotos, ...fieldSpecificPhotos]

      setFieldPhotos(profilePhotos) // Keep for upload/delete of profile photos
      setDerivedStats({ totalArea, fieldCrops: uniqueCrops, allPhotos })

      setError(null)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError('Failed to load profile. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleEditProfile = () => {
    setEditMode(true)
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    setEditedProfile(profile)
    setProfileImage(null)
    setProfileImagePreview(null)
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setEditedProfile({ ...editedProfile, [name]: value })
  }

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImage(file)
      setProfileImagePreview(URL.createObjectURL(file))
    }
  }

  const handleOpenPhotoDialog = () => {
    setSelectedStatus('green')
    setOpenPhotoDialog(true)
  }

  const handleFieldPhotoChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      setNewFieldPhotos([...newFieldPhotos, ...files])

      const newPreviews = files.map((file) => ({
        url: URL.createObjectURL(file),
        caption: '',
        file,
      }))

      setNewFieldPhotosPreviews([...newFieldPhotosPreviews, ...newPreviews])
    }
  }

  const handleCaptionChange = (index, value) => {
    const updatedPreviews = [...newFieldPhotosPreviews]
    updatedPreviews[index].caption = value
    setNewFieldPhotosPreviews(updatedPreviews)
  }

  const handleRemoveNewPhoto = (index) => {
    const updatedPhotos = [...newFieldPhotos]
    const updatedPreviews = [...newFieldPhotosPreviews]

    URL.revokeObjectURL(updatedPreviews[index].url)

    updatedPhotos.splice(index, 1)
    updatedPreviews.splice(index, 1)

    setNewFieldPhotos(updatedPhotos)
    setNewFieldPhotosPreviews(updatedPreviews)
  }

  const handleDeleteFieldPhoto = async (photoId) => {
    try {
      await axios.delete(`/api/farmer/field-photos/${photoId}`)

      setFieldPhotos(prev => prev.filter((photo) => photo._id !== photoId))
      setDerivedStats(prev => ({
        ...prev,
        allPhotos: prev.allPhotos.filter(p => p._id !== photoId)
      }))

      setSnackbar({
        open: true,
        message: 'Field photo deleted successfully!',
        severity: 'success',
      })
    } catch (err) {
      console.error('Error deleting field photo:', err)
      setSnackbar({
        open: true,
        message: 'Failed to delete field photo. Please try again.',
        severity: 'error',
      })
    }
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)

      const formData = new FormData()

      Object.keys(editedProfile).forEach(key => {
        if (typeof editedProfile[key] === 'object' && editedProfile[key] !== null) {
          // Handle objects if needed
        } else {
          formData.append(key, editedProfile[key])
        }
      })

      if (profileImage) {
        formData.append('profileImage', profileImage)
      }

      await axios.put('/api/farmer/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setProfile({
        profileImage: profileImagePreview || profile.profileImage,
        ...editedProfile
      })

      if (editedProfile.name !== user.name) {
        updateUser({ ...user, name: editedProfile.name })
      }

      setEditMode(false)
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      })
    } catch (err) {
      console.error('Error updating profile:', err)
      setSnackbar({
        open: true,
        message: 'Failed to update profile. Please try again.',
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUploadFieldPhotos = async () => {
    if (newFieldPhotos.length === 0) return

    try {
      setLoading(true)

      const formData = new FormData()

      newFieldPhotos.forEach((file, index) => {
        formData.append('photos', file)
        formData.append(
          'captions',
          newFieldPhotosPreviews[index].caption || `Field photo ${index + 1}`
        )
      })

      if (selectedStatus) {
        formData.append('healthStatus', selectedStatus)
      }

      await axios.post('/api/farmer/field-photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const newPhotos = newFieldPhotosPreviews.map((preview, index) => ({
        _id: `temp-${Date.now()}-${index}`,
        url: preview.url,
        caption: preview.caption || `Field photo ${index + 1}`,
        uploadDate: new Date().toISOString(),
      }))

      setFieldPhotos([...newPhotos, ...fieldPhotos])
      setDerivedStats(prev => ({
        ...prev,
        allPhotos: [...newPhotos, ...prev.allPhotos]
      }))

      setNewFieldPhotos([])
      setNewFieldPhotosPreviews([])
      setOpenPhotoDialog(false)

      setSnackbar({
        open: true,
        message: 'Field photos uploaded successfully!',
        severity: 'success',
      })
    } catch (err) {
      console.error('Error uploading field photos:', err)
      setSnackbar({
        open: true,
        message: 'Failed to upload field photos. Please try again.',
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  if (loading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
        <Typography variant="h6" color="error" gutterBottom>{error}</Typography>
        <Button variant="contained" color="primary" onClick={fetchProfile} sx={{ mt: 2 }}>Try Again</Button>
      </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1, pb: 4 }}>
      {/* Header Banner */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
        elevation={3}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={profileImagePreview || profile.profileImage}
            sx={{ width: 80, height: 80, border: '3px solid white', boxShadow: 3 }}
          >
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'F'}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {profile.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              {profile.villageName ? `${profile.villageName}, ` : ''}{profile.panchayatName || 'Farmer Profile'}
            </Typography>
          </Box>
        </Box>

        {!editMode ? (
          <Button
            variant="contained"
            sx={{ bgcolor: 'white', color: '#2E7D32', '&:hover': { bgcolor: '#f5f5f5' } }}
            startIcon={<EditIcon />}
            onClick={handleEditProfile}
          >
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
              startIcon={<CancelIcon />}
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: 'white', color: '#2E7D32', '&:hover': { bgcolor: '#f5f5f5' } }}
              startIcon={<SaveIcon />}
              onClick={handleSaveProfile}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
            </Button>
          </Box>
        )}
      </Paper>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs" textColor="primary" indicatorColor="primary">
          <Tab label="Personal Information" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Farm Details" icon={<AgricultureIcon />} iconPosition="start" />
          <Tab label="Field Photos" icon={<PhotoCameraIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Tab Panel: Personal Information */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Summary Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', boxShadow: 2 }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>FARMER ID: {profile._id?.slice(-6).toUpperCase()}</Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ textAlign: 'left', px: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Contact</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body1">{profile.mobileNo}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Category</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body1">{profile.isWomenFarmer === 'yes' ? 'Women Farmer' : 'General'}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Registered Since</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <CalendarMonthIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body1">{new Date(profile.createdAt || Date.now()).toLocaleDateString()}</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Details Form/View */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, boxShadow: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">Personal Details</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  {editMode ? (
                    <TextField fullWidth label="Full Name" name="name" value={editedProfile.name || ''} onChange={handleProfileChange} variant="outlined" />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">Full Name</Typography>
                      <Typography variant="body1" fontWeight="500">{profile.name}</Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {editMode ? (
                    <TextField fullWidth label="Father/Husband Name" name="fatherOrHusbandName" value={editedProfile.fatherOrHusbandName || ''} onChange={handleProfileChange} variant="outlined" />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">Father/Husband Name</Typography>
                      <Typography variant="body1" fontWeight="500">{profile.fatherOrHusbandName || '-'}</Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {editMode ? (
                    <TextField fullWidth label="Email" name="email" value={editedProfile.email || ''} onChange={handleProfileChange} variant="outlined" />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">Email</Typography>
                      <Typography variant="body1" fontWeight="500">{profile.email || '-'}</Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {editMode ? (
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Is Women Farmer</InputLabel>
                      <Select label="Is Women Farmer" name="isWomenFarmer" value={editedProfile.isWomenFarmer || 'no'} onChange={handleProfileChange}>
                        <MenuItem value="no">No</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">Gender Category</Typography>
                      <Typography variant="body1" fontWeight="500">{profile.isWomenFarmer === 'yes' ? 'Women Farmer' : 'General'}</Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" gutterBottom color="primary">Location & Social</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  {editMode ? (
                    <TextField fullWidth label="Village" name="villageName" value={editedProfile.villageName || ''} onChange={handleProfileChange} variant="outlined" />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">Village</Typography>
                      <Typography variant="body1" fontWeight="500">{profile.villageName || '-'}</Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {editMode ? (
                    <TextField fullWidth label="Panchayat" name="panchayatName" value={editedProfile.panchayatName || ''} onChange={handleProfileChange} variant="outlined" />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">Panchayat</Typography>
                      <Typography variant="body1" fontWeight="500">{profile.panchayatName || '-'}</Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {editMode ? (
                    <TextField fullWidth label="Caste" name="caste" value={editedProfile.caste || ''} onChange={handleProfileChange} variant="outlined" />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">Caste</Typography>
                      <Typography variant="body1" fontWeight="500">{profile.caste || '-'}</Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {editMode ? (
                    <TextField fullWidth label="Group Name" name="groupName" value={editedProfile.groupName || ''} onChange={handleProfileChange} variant="outlined" />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">Group Name</Typography>
                      <Typography variant="body1" fontWeight="500">{profile.groupName || '-'}</Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Tab Panel: Farm Details */}
      {tabValue === 1 && (
        <Box>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                <CardContent>
                  <Typography variant="overline" sx={{ opacity: 0.8 }}>Registered Land</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {derivedStats.totalArea} <Typography component="span" variant="subtitle1">Acres</Typography>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">Active Crops</Typography>
                  <Box sx={{ mt: 1 }}>
                    {derivedStats.fieldCrops.length > 0 ? (
                      derivedStats.fieldCrops.map(c => <Chip key={c} label={c} size="small" sx={{ mr: 0.5, mb: 0.5 }} />)
                    ) : <Typography variant="h6">-</Typography>}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">Income (Est.)</Typography>
                  <Typography variant="h5" fontWeight="bold">₹ {(typeof profile.estimatedIncome === 'object' ? profile.estimatedIncome.current : profile.estimatedIncome)?.toLocaleString() || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">Actual Income</Typography>
                  <Typography variant="h5" fontWeight="bold" color="success.main">₹ {(typeof profile.income === 'object' ? profile.income.current : profile.income)?.toLocaleString() || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Fields List */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Registered Fields</Typography>
                {fields.length > 0 ? (
                  <Grid container spacing={2}>
                    {fields.map(field => (
                      <Grid item xs={12} sm={6} key={field._id}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1" fontWeight="bold">{field.name}</Typography>
                            <Chip label={(typeof field.crop === 'object' ? field.crop.current : field.crop) || 'Fallow'} color={field.crop ? 'success' : 'default'} size="small" />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Size: {typeof field.size === 'object' ? field.size?.value : field.size} Acres
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Location: {field.location?.village || '-'}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography color="text.secondary">No fields registered yet.</Typography>
                )}
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Additional Farm Info</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    {editMode ? (
                      <TextField fullWidth label="Calculated Land Size (Acres)" name="landSize" value={editedProfile.landSize || ''} onChange={handleProfileChange} />
                    ) : (
                      <Box>
                        <Typography variant="caption" color="text.secondary">Manual Land Record</Typography>
                        <Typography variant="body1">
                          {(typeof profile.landSize === 'object' ? `${profile.landSize.value} ${profile.landSize.unit || ''}` : profile.landSize) || '-'}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Manual Crop/Plant Data</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {(profile.plants || []).map((p, i) => <Chip key={i} label={p} variant="outlined" />)}
                        {Array.isArray(profile.crops || profile.cropData) && (profile.crops || profile.cropData).map((c, i) => (
                          <Chip key={`c-${i}`} label={typeof c === 'string' ? c : (c.name || JSON.stringify(c))} color="info" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'primary.dark', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Support Executive</Typography>
                  {profile.assignedExecutive ? (
                    <Box>
                      <Typography variant="subtitle1">{profile.assignedExecutive.name}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>{profile.assignedExecutive.email}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>{profile.assignedExecutive.phone}</Typography>
                      <Button variant="outlined" color="inherit" size="small" sx={{ mt: 2 }} startIcon={<PhoneIcon />}>Call</Button>
                    </Box>
                  ) : (
                    <Typography>No executive assigned.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tab Panel: Field Photos */}
      {tabValue === 2 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Photo Gallery ({derivedStats.allPhotos.length})</Typography>
            <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={handleOpenPhotoDialog}>
              Upload Photo
            </Button>
          </Box>

          {derivedStats.allPhotos.length > 0 ? (
            <Grid container spacing={3}>
              {derivedStats.allPhotos.map((photo, index) => (
                <Grid item xs={12} sm={6} md={4} key={photo._id || index}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        pt: '75%',
                        position: 'relative',
                        backgroundImage: `url(${photo.url || photo.photoUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {!photo.fieldName && (
                        <IconButton
                          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', '&:hover': { bgcolor: 'red' } }}
                          onClick={() => handleDeleteFieldPhoto(photo._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight="bold">{photo.caption || photo.fieldName || 'No Description'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(photo.createdAt || photo.uploadDate || photo.uploadedAt || Date.now()).toLocaleDateString()}
                      </Typography>
                      {photo.fieldName && <Chip size="small" label={photo.fieldName} sx={{ mt: 1, display: 'block', width: 'fit-content' }} />}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 5, textAlign: 'center', color: 'text.secondary' }}>
              <PhotoCameraIcon sx={{ fontSize: 60, mb: 2, opacity: 0.2 }} />
              <Typography>No photos found. Upload photos or register fields with photos.</Typography>
            </Paper>
          )}
        </Box>
      )}


      {/* Upload Field Photos Dialog */}
      <Dialog
        open={openPhotoDialog}
        onClose={() => setOpenPhotoDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload Field Photos</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Upload generic photos or photos of your fields.
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
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
            sx={{ mb: 3 }}
          >
            Select Photos
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleFieldPhotoChange}
            />
          </Button>

          {newFieldPhotosPreviews.length > 0 && (
            <Grid container spacing={2}>
              {newFieldPhotosPreviews.map((preview, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Box component="img" src={preview.url} sx={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 1 }} />
                      <TextField size="small" fullWidth placeholder="Caption" value={preview.caption} onChange={(e) => handleCaptionChange(index, e.target.value)} sx={{ mt: 1 }} />
                      <Button size="small" color="error" fullWidth onClick={() => handleRemoveNewPhoto(index)}>Remove</Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPhotoDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUploadFieldPhotos}
            color="primary"
            variant="contained"
            disabled={newFieldPhotos.length === 0 || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default Profile