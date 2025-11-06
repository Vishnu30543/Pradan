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
  Stack,
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
  Home as HomeIcon,
  CalendarMonth as CalendarMonthIcon,
  Agriculture as AgricultureIcon,
  Grass as GrassIcon,
  // Eco as EcoIcon,
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
  const [newFieldPhotos, setNewFieldPhotos] = useState([])
  const [newFieldPhotosPreviews, setNewFieldPhotosPreviews] = useState([])
  const [tabValue, setTabValue] = useState(0)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/farmer/profile')
      setProfile(response.data.profile)
      setEditedProfile(response.data.profile)
      setError(null)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError('Failed to load profile. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // For demo purposes, simulate API response with mock data
  useEffect(() => {
    const simulateApiResponse = () => {
      setTimeout(() => {
        const mockProfile = {
          _id: '1',
          name: 'Rajesh Kumar',
          mobile: '9876543210',
          email: 'rajesh.kumar@example.com',
          address: {
            village: 'Sundarpur',
            district: 'Varanasi',
            state: 'Uttar Pradesh',
            pincode: '221005',
          },
          gender: 'male',
          age: 45,
          landDetails: {
            totalArea: 5.5,
            cultivableArea: 5,
            soilType: 'black soil',
            irrigationSource: 'tube well',
          },
          crops: [
            { name: 'Wheat', area: 2.5, season: 'rabi' },
            { name: 'Rice', area: 2, season: 'kharif' },
            { name: 'Mustard', area: 0.5, season: 'rabi' },
          ],
          bankDetails: {
            accountNumber: 'XXXX1234',
            bankName: 'State Bank of India',
            ifscCode: 'SBIN0001234',
            accountHolderName: 'Rajesh Kumar',
          },
          registrationDate: '2022-05-15T10:30:00.000Z',
          profileImage: 'https://randomuser.me/api/portraits/men/75.jpg',
          fieldPhotos: [
            {
              _id: '1',
              url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8',
              caption: 'Wheat field - January 2023',
              uploadDate: '2023-01-15T08:30:00.000Z',
            },
            {
              _id: '2',
              url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
              caption: 'Rice field - July 2022',
              uploadDate: '2022-07-20T14:45:00.000Z',
            },
            {
              _id: '3',
              url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399',
              caption: 'Mustard field - November 2022',
              uploadDate: '2022-11-05T11:20:00.000Z',
            },
          ],
          assignedExecutive: {
            _id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '9876543211',
          },
        }

        setProfile(mockProfile)
        setEditedProfile(mockProfile)
        setFieldPhotos(mockProfile.fieldPhotos)
        setLoading(false)
      }, 1000)
    }

    // Use mock data for demo
    simulateApiResponse()
    // In production, use the actual API call
    // fetchProfile()
  }, [])

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

    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setEditedProfile({
        ...editedProfile,
        [parent]: {
          ...editedProfile[parent],
          [child]: value,
        },
      })
    } else {
      setEditedProfile({ ...editedProfile, [name]: value })
    }
  }

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImage(file)
      setProfileImagePreview(URL.createObjectURL(file))
    }
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

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(updatedPreviews[index].url)

    updatedPhotos.splice(index, 1)
    updatedPreviews.splice(index, 1)

    setNewFieldPhotos(updatedPhotos)
    setNewFieldPhotosPreviews(updatedPreviews)
  }

  const handleDeleteFieldPhoto = async (photoId) => {
    try {
      await axios.delete(`/api/farmer/field-photos/${photoId}`)

      // Simulate API response for demo
      setFieldPhotos(fieldPhotos.filter((photo) => photo._id !== photoId))

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

      // Create FormData for profile update with image
      const formData = new FormData()

      // Append profile data as JSON
      formData.append('profile', JSON.stringify(editedProfile))

      // Append profile image if changed
      if (profileImage) {
        formData.append('profileImage', profileImage)
      }

      await axios.put('/api/farmer/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Simulate API response for demo
      setProfile({
        ...editedProfile,
        profileImage: profileImagePreview || profile.profileImage,
      })

      // Update user context if name changed
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

      // Create FormData for field photos
      const formData = new FormData()

      // Append each photo and its caption
      newFieldPhotos.forEach((file, index) => {
        formData.append('photos', file)
        formData.append(
          'captions',
          newFieldPhotosPreviews[index].caption || `Field photo ${index + 1}`
        )
      })

      await axios.post('/api/farmer/field-photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Simulate API response for demo
      const newPhotos = newFieldPhotosPreviews.map((preview, index) => ({
        _id: `temp-${Date.now()}-${index}`,
        url: preview.url,
        caption: preview.caption || `Field photo ${index + 1}`,
        uploadDate: new Date().toISOString(),
      }))

      setFieldPhotos([...newPhotos, ...fieldPhotos])
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
          onClick={fetchProfile}
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
        {!editMode ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEditProfile}
          >
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveProfile}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        )}
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="profile tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Personal Information" />
          <Tab label="Farm Details" />
          <Tab label="Field Photos" />
          <Tab label="Bank Details" />
        </Tabs>
      </Box>

      {/* Personal Information Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={
                      profileImagePreview ||
                      profile.profileImage ||
                      '/static/images/avatar/farmer.png'
                    }
                    alt={profile.name}
                    sx={{ width: 150, height: 150, mb: 2 }}
                  />
                  {editMode && (
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: 10,
                        right: 0,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleProfileImageChange}
                      />
                      <PhotoCameraIcon />
                    </IconButton>
                  )}
                </Box>

                <Typography variant="h5" gutterBottom>
                  {profile.name}
                </Typography>

                <Chip
                  icon={<PhoneIcon />}
                  label={profile.mobile}
                  sx={{ mb: 1 }}
                />

                {profile.email && (
                  <Chip
                    icon={<EmailIcon />}
                    label={profile.email}
                    sx={{ mb: 1 }}
                  />
                )}

                <Divider sx={{ width: '100%', my: 2 }} />

                <Box sx={{ textAlign: 'left', width: '100%' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <LocationOnIcon
                      fontSize="small"
                      sx={{ verticalAlign: 'middle', mr: 1 }}
                    />
                    {`${profile.address.village}, ${profile.address.district}, ${profile.address.state} - ${profile.address.pincode}`}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <PersonIcon
                      fontSize="small"
                      sx={{ verticalAlign: 'middle', mr: 1 }}
                    />
                    {profile.gender === 'male' ? 'Male' : 'Female'}, {profile.age} years
                  </Typography>

                  <Typography variant="body2">
                    <CalendarMonthIcon
                      fontSize="small"
                      sx={{ verticalAlign: 'middle', mr: 1 }}
                    />
                    Registered on{' '}
                    {new Date(profile.registrationDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Personal Details */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Personal Details
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={editMode ? editedProfile.name : profile.name}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                    InputProps={{
                      readOnly: !editMode,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobile"
                    value={editMode ? editedProfile.mobile : profile.mobile}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                    InputProps={{
                      readOnly: !editMode,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={
                      editMode
                        ? editedProfile.email || ''
                        : profile.email || ''
                    }
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                    InputProps={{
                      readOnly: !editMode,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                  >
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      name="gender"
                      value={editMode ? editedProfile.gender : profile.gender}
                      onChange={handleProfileChange}
                      label="Gender"
                      inputProps={{
                        readOnly: !editMode,
                      }}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    name="age"
                    type="number"
                    value={editMode ? editedProfile.age : profile.age}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                    InputProps={{
                      readOnly: !editMode,
                    }}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Address
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Village"
                    name="address.village"
                    value={
                      editMode
                        ? editedProfile.address.village
                        : profile.address.village
                    }
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                    InputProps={{
                      readOnly: !editMode,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="District"
                    name="address.district"
                    value={
                      editMode
                        ? editedProfile.address.district
                        : profile.address.district
                    }
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                    InputProps={{
                      readOnly: !editMode,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    name="address.state"
                    value={
                      editMode
                        ? editedProfile.address.state
                        : profile.address.state
                    }
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                    InputProps={{
                      readOnly: !editMode,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="PIN Code"
                    name="address.pincode"
                    value={
                      editMode
                        ? editedProfile.address.pincode
                        : profile.address.pincode
                    }
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                    InputProps={{
                      readOnly: !editMode,
                    }}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Executive Details
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Executive Name"
                    value={profile.assignedExecutive?.name || 'Not Assigned'}
                    disabled
                    variant="filled"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Executive Contact"
                    value={profile.assignedExecutive?.phone || 'N/A'}
                    disabled
                    variant="filled"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Executive Email"
                    value={profile.assignedExecutive?.email || 'N/A'}
                    disabled
                    variant="filled"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Farm Details Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {/* Land Details */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Land Details
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total Land Area (Acres)"
                    name="landDetails.totalArea"
                    type="number"
                    value={
                      editMode
                        ? editedProfile.landDetails.totalArea
                        : profile.landDetails.totalArea
                    }
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                    InputProps={{
                      readOnly: !editMode,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cultivable Area (Acres)"
                    name="landDetails.cultivableArea"
                    type="number"
                    value={
                      editMode
                        ? editedProfile.landDetails.cultivableArea
                        : profile.landDetails.cultivableArea
                    }
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                    InputProps={{
                      readOnly: !editMode,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Soil Type"
                    name="landDetails.soilType"
                    value={
                      editMode
                        ? editedProfile.landDetails.soilType
                        : profile.landDetails.soilType
                    }
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                    InputProps={{
                      readOnly: !editMode,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Irrigation Source"
                    name="landDetails.irrigationSource"
                    value={
                      editMode
                        ? editedProfile.landDetails.irrigationSource
                        : profile.landDetails.irrigationSource
                    }
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                    InputProps={{
                      readOnly: !editMode,
                    }}
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px dashed',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AgricultureIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Land Usage Summary</Typography>
                </Box>
                <Typography variant="body2" gutterBottom>
                  <strong>Total Area:</strong> {profile.landDetails.totalArea} acres
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Cultivable Area:</strong>{' '}
                  {profile.landDetails.cultivableArea} acres ({
                    Math.round(
                      (profile.landDetails.cultivableArea /
                        profile.landDetails.totalArea) *
                        100
                    )
                  }%)
                </Typography>
                <Typography variant="body2">
                  <strong>Uncultivable Area:</strong>{' '}
                  {profile.landDetails.totalArea -
                    profile.landDetails.cultivableArea}{' '}
                  acres
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Crop Details */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Crop Details
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {profile.crops.map((crop, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <GrassIcon
                      color={
                        crop.season === 'kharif'
                          ? 'success'
                          : crop.season === 'rabi'
                          ? 'warning'
                          : 'info'
                      }
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="subtitle1">{crop.name}</Typography>
                    <Chip
                      label={crop.season.toUpperCase()}
                      size="small"
                      sx={{ ml: 'auto' }}
                      color={
                        crop.season === 'kharif'
                          ? 'success'
                          : crop.season === 'rabi'
                          ? 'warning'
                          : 'info'
                      }
                    />
                  </Box>
                  <Typography variant="body2">
                    <strong>Area:</strong> {crop.area} acres ({
                      Math.round(
                        (crop.area / profile.landDetails.cultivableArea) * 100
                      )
                    }% of
                    cultivable land)
                  </Typography>
                </Box>
              ))}

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px dashed',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {/* <EcoIcon color="success" sx={{ mr: 1 }} /> */}
                  <Typography variant="subtitle1">Crop Distribution</Typography>
                </Box>
                {profile.crops.map((crop, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {crop.name}
                      </Typography>
                      <Typography variant="body2">
                        {Math.round(
                          (crop.area / profile.landDetails.cultivableArea) * 100
                        )}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: 8,
                        bgcolor: 'grey.200',
                        borderRadius: 5,
                        mt: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${Math.round(
                            (crop.area / profile.landDetails.cultivableArea) * 100
                          )}%`,
                          bgcolor:
                            crop.season === 'kharif'
                              ? 'success.main'
                              : crop.season === 'rabi'
                              ? 'warning.main'
                              : 'info.main',
                          borderRadius: 5,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Field Photos Tab */}
      {tabValue === 2 && (
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h6">Field Photos</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={() => setOpenPhotoDialog(true)}
            >
              Upload Photos
            </Button>
          </Box>

          {fieldPhotos.length > 0 ? (
            <Grid container spacing={3}>
              {fieldPhotos.map((photo, index) => (
                <Grid item xs={12} sm={6} md={4} key={photo._id}>
                  <Card>
                    <Box
                      sx={{
                        position: 'relative',
                        paddingTop: '75%', // 4:3 aspect ratio
                        backgroundImage: `url(${photo.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(0, 0, 0, 0.5)',
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                        onClick={() => handleDeleteFieldPhoto(photo._id)}
                      >
                        <DeleteIcon sx={{ color: 'white' }} />
                      </IconButton>
                    </Box>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {photo.caption}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Uploaded on {new Date(photo.uploadDate).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No field photos uploaded yet. Click the button above to upload
                photos of your farm.
              </Typography>
            </Paper>
          )}
        </Box>
      )}

      {/* Bank Details Tab */}
      {tabValue === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Bank Account Details
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Account Holder Name"
                name="bankDetails.accountHolderName"
                value={
                  editMode
                    ? editedProfile.bankDetails.accountHolderName
                    : profile.bankDetails.accountHolderName
                }
                onChange={handleProfileChange}
                disabled={!editMode}
                variant={editMode ? 'outlined' : 'filled'}
                InputProps={{
                  readOnly: !editMode,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bank Name"
                name="bankDetails.bankName"
                value={
                  editMode
                    ? editedProfile.bankDetails.bankName
                    : profile.bankDetails.bankName
                }
                onChange={handleProfileChange}
                disabled={!editMode}
                variant={editMode ? 'outlined' : 'filled'}
                InputProps={{
                  readOnly: !editMode,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Account Number"
                name="bankDetails.accountNumber"
                value={
                  editMode
                    ? editedProfile.bankDetails.accountNumber
                    : profile.bankDetails.accountNumber
                }
                onChange={handleProfileChange}
                disabled={!editMode}
                variant={editMode ? 'outlined' : 'filled'}
                InputProps={{
                  readOnly: !editMode,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="IFSC Code"
                name="bankDetails.ifscCode"
                value={
                  editMode
                    ? editedProfile.bankDetails.ifscCode
                    : profile.bankDetails.ifscCode
                }
                onChange={handleProfileChange}
                disabled={!editMode}
                variant={editMode ? 'outlined' : 'filled'}
                InputProps={{
                  readOnly: !editMode,
                }}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Bank Account Information</Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>
              This bank account is used for all financial transactions, including
              payments for your produce, subsidies, and carbon credit benefits.
              Please ensure the details are accurate.
            </Typography>
          </Box>
        </Paper>
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
            Upload photos of your fields to help executives monitor crop health
            and provide better assistance.
          </Typography>

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
                    <Box
                      sx={{
                        position: 'relative',
                        paddingTop: '75%', // 4:3 aspect ratio
                        backgroundImage: `url(${preview.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(0, 0, 0, 0.5)',
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                        onClick={() => handleRemoveNewPhoto(index)}
                      >
                        <DeleteIcon sx={{ color: 'white' }} />
                      </IconButton>
                    </Box>
                    <CardContent>
                      <TextField
                        fullWidth
                        label="Caption"
                        placeholder="Describe this field photo"
                        value={preview.caption}
                        onChange={(e) =>
                          handleCaptionChange(index, e.target.value)
                        }
                        variant="outlined"
                        size="small"
                      />
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

export default Profile