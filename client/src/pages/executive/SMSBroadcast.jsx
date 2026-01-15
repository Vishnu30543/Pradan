import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Badge,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Send as SendIcon,
  Message as MessageIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  SelectAll as SelectAllIcon,
  Clear as ClearIcon,
  Schedule as ScheduleIcon,
  Agriculture as AgricultureIcon,
} from '@mui/icons-material'
import axios from 'axios'

const SMSBroadcast = () => {
  const [farmers, setFarmers] = useState([])
  const [selectedFarmers, setSelectedFarmers] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingFarmers, setLoadingFarmers] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterVillage, setFilterVillage] = useState('')
  const [villages, setVillages] = useState([])
  const [smsHistory, setSmsHistory] = useState([])
  const [tabValue, setTabValue] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  // Predefined message templates
  const messageTemplates = [
    {
      id: 1,
      title: 'Weather Alert',
      message: 'Weather Alert: Heavy rainfall expected in the next 48 hours. Please take necessary precautions to protect your crops.',
    },
    {
      id: 2,
      title: 'Scheme Reminder',
      message: 'Reminder: Last date for PM-KISAN registration is approaching. Please submit your documents at the nearest CSC.',
    },
    {
      id: 3,
      title: 'Field Visit',
      message: 'Your field visit has been scheduled for tomorrow. Our executive will contact you before arrival.',
    },
    {
      id: 4,
      title: 'Market Price',
      message: 'Today\'s Market Prices: Wheat ₹2,200/quintal, Rice ₹1,850/quintal, Cotton ₹6,500/quintal.',
    },
    {
      id: 5,
      title: 'Pest Alert',
      message: 'Pest Alert: Fall armyworm infestation reported in nearby areas. Inspect your maize crops and apply recommended pesticides.',
    },
  ]

  useEffect(() => {
    fetchFarmers()
    fetchSmsHistory()
  }, [])

  const fetchFarmers = async () => {
    try {
      setLoadingFarmers(true)
      const response = await axios.get('/api/executive/farmers')
      const farmersData = response.data.farmers || []
      setFarmers(farmersData)

      // Extract unique villages for filter
      const uniqueVillages = [...new Set(farmersData.map(farmer => farmer.villageName).filter(Boolean))]
      setVillages(uniqueVillages)
    } catch (err) {
      console.error('Error fetching farmers:', err)
      setSnackbar({
        open: true,
        message: 'Failed to load farmers',
        severity: 'error',
      })
    } finally {
      setLoadingFarmers(false)
    }
  }

  const fetchSmsHistory = async () => {
    try {
      const response = await axios.get('/api/executive/dashboard')
      if (response.data.dashboard?.recentSMS) {
        setSmsHistory(response.data.dashboard.recentSMS)
      }
    } catch (err) {
      console.error('Error fetching SMS history:', err)
    }
  }

  const handleSelectFarmer = (farmerId) => {
    setSelectedFarmers(prev => {
      if (prev.includes(farmerId)) {
        return prev.filter(id => id !== farmerId)
      }
      return [...prev, farmerId]
    })
  }

  const handleSelectAll = () => {
    if (selectedFarmers.length === filteredFarmers.length) {
      setSelectedFarmers([])
    } else {
      setSelectedFarmers(filteredFarmers.map(f => f._id))
    }
  }

  const handleSelectByVillage = (village) => {
    const villageFarmers = farmers.filter(f => f.villageName === village).map(f => f._id)
    const allSelected = villageFarmers.every(id => selectedFarmers.includes(id))

    if (allSelected) {
      setSelectedFarmers(prev => prev.filter(id => !villageFarmers.includes(id)))
    } else {
      setSelectedFarmers(prev => [...new Set([...prev, ...villageFarmers])])
    }
  }

  const handleUseTemplate = (template) => {
    setMessage(template.message)
  }

  const handleSendSMS = async () => {
    if (!message.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a message',
        severity: 'error',
      })
      return
    }

    if (selectedFarmers.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one farmer',
        severity: 'error',
      })
      return
    }

    try {
      setLoading(true)
      const response = await axios.post('/api/executive/sms', {
        message,
        farmerIds: selectedFarmers,
      })

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: `SMS sent successfully to ${selectedFarmers.length} farmer(s)!`,
          severity: 'success',
        })
        setMessage('')
        setSelectedFarmers([])
        setPreviewOpen(false)
        fetchSmsHistory() // Refresh SMS history
      }
    } catch (err) {
      console.error('Error sending SMS:', err)
      const errorMessage = err.response?.data?.message || 'Failed to send SMS. Please try again.'
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
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

  const selectedFarmerDetails = farmers.filter(f => selectedFarmers.includes(f._id))
  const characterCount = message.length
  const smsCount = Math.ceil(characterCount / 160) || 0

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MessageIcon color="primary" />
        SMS Broadcast
      </Typography>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab icon={<SendIcon />} label="Send SMS" />
        <Tab icon={<HistoryIcon />} label="SMS History" />
      </Tabs>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Left Panel - Farmer Selection */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon />
                Select Recipients
                <Chip
                  label={`${selectedFarmers.length} selected`}
                  color="primary"
                  size="small"
                  sx={{ ml: 'auto' }}
                />
              </Typography>

              {/* Search and Filter */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search farmers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1 }}
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Filter by Village</InputLabel>
                  <Select
                    value={filterVillage}
                    onChange={(e) => setFilterVillage(e.target.value)}
                    label="Filter by Village"
                  >
                    <MenuItem value="">All Villages</MenuItem>
                    {villages.map((village) => (
                      <MenuItem key={village} value={village}>
                        {village}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Quick Actions */}
              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<SelectAllIcon />}
                  onClick={handleSelectAll}
                >
                  {selectedFarmers.length === filteredFarmers.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={() => setSelectedFarmers([])}
                  disabled={selectedFarmers.length === 0}
                >
                  Clear
                </Button>
              </Box>

              {/* Village Quick Select */}
              {villages.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Quick select by village:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {villages.slice(0, 5).map((village) => (
                      <Chip
                        key={village}
                        label={village}
                        size="small"
                        variant="outlined"
                        onClick={() => handleSelectByVillage(village)}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Divider sx={{ mb: 2 }} />

              {/* Farmer List */}
              {loadingFarmers ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {filteredFarmers.length > 0 ? (
                    filteredFarmers.map((farmer) => (
                      <ListItem
                        key={farmer._id}
                        dense
                        button
                        onClick={() => handleSelectFarmer(farmer._id)}
                        sx={{
                          borderRadius: 1,
                          mb: 0.5,
                          bgcolor: selectedFarmers.includes(farmer._id) ? 'action.selected' : 'transparent',
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: selectedFarmers.includes(farmer._id) ? 'primary.main' : 'grey.400' }}>
                            {selectedFarmers.includes(farmer._id) ? <CheckCircleIcon /> : <PersonIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={farmer.name}
                          secondary={
                            <>
                              {farmer.mobileNo} • {farmer.villageName}
                            </>
                          }
                        />
                        <Checkbox
                          checked={selectedFarmers.includes(farmer._id)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography color="text.secondary" textAlign="center" sx={{ p: 3 }}>
                      No farmers found
                    </Typography>
                  )}
                </List>
              )}
            </Paper>
          </Grid>

          {/* Right Panel - Compose Message */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MessageIcon />
                Compose Message
              </Typography>

              {/* Message Templates */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Quick Templates:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {messageTemplates.map((template) => (
                    <Chip
                      key={template.id}
                      label={template.title}
                      onClick={() => handleUseTemplate(template)}
                      variant="outlined"
                      color="primary"
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Message Input */}
              <TextField
                fullWidth
                multiline
                rows={6}
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />

              {/* Character Count */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {characterCount} characters • {smsCount} SMS ({smsCount * selectedFarmers.length} total)
                </Typography>
                <Button
                  size="small"
                  onClick={() => setMessage('')}
                  disabled={!message}
                >
                  Clear
                </Button>
              </Box>

              {/* Selected Farmers Summary */}
              {selectedFarmers.length > 0 && (
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Recipients ({selectedFarmers.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selectedFarmerDetails.slice(0, 5).map((farmer) => (
                        <Chip
                          key={farmer._id}
                          label={`${farmer.name} (${farmer.mobileNo})`}
                          size="small"
                          onDelete={() => handleSelectFarmer(farmer._id)}
                        />
                      ))}
                      {selectedFarmers.length > 5 && (
                        <Chip
                          label={`+${selectedFarmers.length - 5} more`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Send Button */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setPreviewOpen(true)}
                  disabled={!message.trim() || selectedFarmers.length === 0}
                >
                  Preview
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  onClick={handleSendSMS}
                  disabled={loading || !message.trim() || selectedFarmers.length === 0}
                  sx={{ flex: 1 }}
                >
                  {loading ? 'Sending...' : `Send to ${selectedFarmers.length} Farmer(s)`}
                </Button>
              </Box>
            </Paper>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h5">{farmers.length}</Typography>
                    <Typography variant="caption" color="text.secondary">Total Farmers</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                    <Typography variant="h5">{selectedFarmers.length}</Typography>
                    <Typography variant="caption" color="text.secondary">Selected</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <HistoryIcon color="info" sx={{ fontSize: 40 }} />
                    <Typography variant="h5">{smsHistory.length}</Typography>
                    <Typography variant="caption" color="text.secondary">SMS Sent</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* SMS History Tab */}
      {tabValue === 1 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon />
            Recent SMS History
          </Typography>

          {smsHistory.length > 0 ? (
            <List>
              {smsHistory.map((sms, index) => (
                <Box key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <MessageIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body1">
                            {sms.message?.substring(0, 50) || 'No message'}...
                          </Typography>
                          <Chip
                            label={`${sms.sentTo?.length || 0} recipients`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" color="text.secondary">
                            Sent on: {new Date(sms.timestamp).toLocaleString()}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="text.secondary">
                            To: {sms.sentTo?.slice(0, 3).join(', ')}{sms.sentTo?.length > 3 ? ` and ${sms.sentTo.length - 3} more` : ''}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < smsHistory.length - 1 && <Divider variant="inset" component="li" />}
                </Box>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <MessageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                No SMS history found
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Preview SMS
        </DialogTitle>
        <DialogContent>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Message Preview
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {message}
              </Typography>
            </CardContent>
          </Card>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Sending to {selectedFarmers.length} recipient(s):
            </Typography>
            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
              {selectedFarmerDetails.map((farmer) => (
                <Chip
                  key={farmer._id}
                  label={`${farmer.name} (${farmer.mobileNo})`}
                  size="small"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>
          <Alert severity="info">
            This will send {smsCount} SMS to each recipient ({smsCount * selectedFarmers.length} total SMS)
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            onClick={handleSendSMS}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send SMS'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default SMSBroadcast