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
  Badge,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  ListItem,
  TextareaAutosize,
  FormHelperText,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Comment as CommentIcon,
  Assignment as AssignmentIcon,
  PriorityHigh as PriorityHighIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const RequestManagement = () => {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [openCommentDialog, setOpenCommentDialog] = useState(false)
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [statusReason, setStatusReason] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/executive/requests')
      setRequests(response.data.requests)
      setError(null)
    } catch (err) {
      console.error('Error fetching requests:', err)
      setError('Failed to load requests. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // For demo purposes, simulate API response with mock data
  useEffect(() => {
    const simulateApiResponse = () => {
      setTimeout(() => {
        setRequests([
          {
            _id: '1',
            title: 'Need assistance with irrigation system',
            description: 'My drip irrigation system is not working properly. Need technical help to fix it.',
            status: 'pending',
            priority: 'high',
            category: 'irrigation-issue',
            createdAt: '2023-06-10T08:30:00.000Z',
            updatedAt: '2023-06-10T08:30:00.000Z',
            farmer: {
              _id: '1',
              name: 'Rajesh Kumar',
              mobileNo: '9876543210',
              village: 'Sundarpur',
            },
            attachments: [
              {
                fileName: 'irrigation_photo.jpg',
                filePath: '/uploads/images/irrigation_photo.jpg',
                fileType: 'image/jpeg',
                uploadDate: '2023-06-10T08:30:00.000Z',
              },
            ],
            comments: [
              {
                text: 'I have tried restarting the pump but it didn\'t work.',
                postedBy: 'farmer',
                userId: '1',
                userName: 'Rajesh Kumar',
                createdAt: '2023-06-10T09:15:00.000Z',
              },
            ],
          },
          {
            _id: '2',
            title: 'Request for financial assistance for new seeds',
            description: 'I need financial help to purchase high-quality seeds for the upcoming season.',
            status: 'in-progress',
            priority: 'medium',
            category: 'financial-assistance',
            createdAt: '2023-06-08T14:20:00.000Z',
            updatedAt: '2023-06-09T10:45:00.000Z',
            farmer: {
              _id: '2',
              name: 'Lakshmi Devi',
              mobileNo: '8765432109',
              village: 'Chandpur',
            },
            attachments: [],
            comments: [
              {
                text: 'I need approximately ₹15,000 for seeds.',
                postedBy: 'farmer',
                userId: '2',
                userName: 'Lakshmi Devi',
                createdAt: '2023-06-08T14:20:00.000Z',
              },
              {
                text: 'We are reviewing your request. Will get back to you soon.',
                postedBy: 'executive',
                userId: '1',
                userName: 'John Doe',
                createdAt: '2023-06-09T10:45:00.000Z',
              },
            ],
          },
          {
            _id: '3',
            title: 'Crop disease identification',
            description: 'My wheat crop has yellow spots on leaves. Need help identifying the disease and treatment.',
            status: 'resolved',
            priority: 'urgent',
            category: 'crop-disease',
            createdAt: '2023-06-05T11:30:00.000Z',
            updatedAt: '2023-06-07T16:20:00.000Z',
            resolvedDate: '2023-06-07T16:20:00.000Z',
            farmer: {
              _id: '3',
              name: 'Suresh Patel',
              mobileNo: '7654321098',
              village: 'Rampur',
            },
            attachments: [
              {
                fileName: 'wheat_disease.jpg',
                filePath: '/uploads/images/wheat_disease.jpg',
                fileType: 'image/jpeg',
                uploadDate: '2023-06-05T11:30:00.000Z',
              },
            ],
            comments: [
              {
                text: 'Please help urgently as it\'s spreading fast.',
                postedBy: 'farmer',
                userId: '3',
                userName: 'Suresh Patel',
                createdAt: '2023-06-05T11:30:00.000Z',
              },
              {
                text: 'This appears to be yellow rust. I\'ll visit tomorrow to confirm.',
                postedBy: 'executive',
                userId: '1',
                userName: 'John Doe',
                createdAt: '2023-06-06T09:15:00.000Z',
              },
              {
                text: 'Confirmed it\'s yellow rust. I\'ve provided the necessary fungicide and application instructions.',
                postedBy: 'executive',
                userId: '1',
                userName: 'John Doe',
                createdAt: '2023-06-07T16:20:00.000Z',
              },
            ],
          },
          {
            _id: '4',
            title: 'Training request for organic farming',
            description: 'I want to learn organic farming techniques. Please arrange training.',
            status: 'pending',
            priority: 'low',
            category: 'training-request',
            createdAt: '2023-06-12T13:45:00.000Z',
            updatedAt: '2023-06-12T13:45:00.000Z',
            farmer: {
              _id: '4',
              name: 'Meena Singh',
              mobileNo: '6543210987',
              village: 'Krishnapur',
            },
            attachments: [],
            comments: [],
          },
          {
            _id: '5',
            title: 'Market access for vegetable produce',
            description: 'I need help connecting with buyers for my vegetable produce.',
            status: 'rejected',
            priority: 'medium',
            category: 'market-access',
            createdAt: '2023-06-01T10:20:00.000Z',
            updatedAt: '2023-06-03T15:30:00.000Z',
            farmer: {
              _id: '5',
              name: 'Arjun Reddy',
              mobileNo: '5432109876',
              village: 'Nandpur',
            },
            attachments: [],
            comments: [
              {
                text: 'I have approximately 500kg of tomatoes and 300kg of cucumbers ready for sale.',
                postedBy: 'farmer',
                userId: '5',
                userName: 'Arjun Reddy',
                createdAt: '2023-06-01T10:20:00.000Z',
              },
              {
                text: 'Currently, we don\'t have market connections for these vegetables in your area. We suggest selling at the local mandi.',
                postedBy: 'executive',
                userId: '1',
                userName: 'John Doe',
                createdAt: '2023-06-03T15:30:00.000Z',
              },
            ],
          },
        ])
        setLoading(false)
      }, 1000)
    }

    // Use mock data for demo
    simulateApiResponse()
    // In production, use the actual API call
    // fetchRequests()
  }, [])

  const handleAddComment = async () => {
    if (!comment.trim()) {
      setCommentError('Comment cannot be empty')
      return
    }

    try {
      setLoading(true)
      await axios.post(`/api/executive/requests/${selectedRequest._id}/comment`, {
        text: comment,
      })

      // Simulate API response for demo
      const updatedRequests = requests.map((req) => {
        if (req._id === selectedRequest._id) {
          return {
            ...req,
            comments: [
              ...req.comments,
              {
                text: comment,
                postedBy: 'executive',
                userId: user._id,
                userName: user.name,
                createdAt: new Date().toISOString(),
              },
            ],
          }
        }
        return req
      })

      setRequests(updatedRequests)
      setSelectedRequest({
        ...selectedRequest,
        comments: [
          ...selectedRequest.comments,
          {
            text: comment,
            postedBy: 'executive',
            userId: user._id,
            userName: user.name,
            createdAt: new Date().toISOString(),
          },
        ],
      })

      setComment('')
      setCommentError('')
      setOpenCommentDialog(false)
      setSnackbar({
        open: true,
        message: 'Comment added successfully!',
        severity: 'success',
      })
    } catch (err) {
      console.error('Error adding comment:', err)
      setSnackbar({
        open: true,
        message: 'Failed to add comment. Please try again.',
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      return
    }

    try {
      setLoading(true)
      await axios.put(`/api/executive/requests/${selectedRequest._id}/status`, {
        status: newStatus,
        statusReason: statusReason,
      })

      // Simulate API response for demo
      const updatedRequests = requests.map((req) => {
        if (req._id === selectedRequest._id) {
          const updatedReq = {
            ...req,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }

          if (newStatus === 'resolved') {
            updatedReq.resolvedDate = new Date().toISOString()
          }

          if (statusReason) {
            updatedReq.comments = [
              ...req.comments,
              {
                text: `Status updated to ${newStatus}: ${statusReason}`,
                postedBy: 'executive',
                userId: user._id,
                userName: user.name,
                createdAt: new Date().toISOString(),
              },
            ]
          }

          return updatedReq
        }
        return req
      })

      setRequests(updatedRequests)
      setOpenStatusDialog(false)
      setNewStatus('')
      setStatusReason('')
      setSnackbar({
        open: true,
        message: 'Request status updated successfully!',
        severity: 'success',
      })
    } catch (err) {
      console.error('Error updating status:', err)
      setSnackbar({
        open: true,
        message: 'Failed to update status. Please try again.',
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendSMS = async (farmerId, farmerName, farmerMobile) => {
    try {
      await axios.post('/api/executive/send-sms', {
        farmerId,
        message: `Dear ${farmerName}, your request has been updated. Please check the app for details.`,
      })

      setSnackbar({
        open: true,
        message: `SMS sent to ${farmerName} successfully!`,
        severity: 'success',
      })
    } catch (err) {
      console.error('Error sending SMS:', err)
      setSnackbar({
        open: true,
        message: 'Failed to send SMS. Please try again.',
        severity: 'error',
      })
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleMenuOpen = (event, request) => {
    setAnchorEl(event.currentTarget)
    setSelectedRequest(request)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Filter requests based on search term, status, priority, category, and tab value
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.farmer.village.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus ? request.status === filterStatus : true
    const matchesPriority = filterPriority ? request.priority === filterPriority : true
    const matchesCategory = filterCategory ? request.category === filterCategory : true

    const matchesTab =
      (tabValue === 0) || // All
      (tabValue === 1 && request.status === 'pending') || // Pending
      (tabValue === 2 && request.status === 'in-progress') || // In Progress
      (tabValue === 3 && request.status === 'resolved') || // Resolved
      (tabValue === 4 && request.status === 'rejected') || // Rejected
      (tabValue === 5 && request.priority === 'urgent') // Urgent

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesTab
  })

  // Calculate statistics
  const totalRequests = requests.length
  const pendingRequests = requests.filter((req) => req.status === 'pending').length
  const inProgressRequests = requests.filter((req) => req.status === 'in-progress').length
  const resolvedRequests = requests.filter((req) => req.status === 'resolved').length
  const rejectedRequests = requests.filter((req) => req.status === 'rejected').length
  const urgentRequests = requests.filter((req) => req.priority === 'urgent').length

  // Get unique categories for filter
  const categories = [...new Set(requests.map((req) => req.category))]

  if (loading && requests.length === 0) {
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
          Request Management
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total
              </Typography>
              <Typography variant="h3">{totalRequests}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ bgcolor: 'info.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h3">{pendingRequests}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ bgcolor: 'warning.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h3">{inProgressRequests}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resolved
              </Typography>
              <Typography variant="h3">{resolvedRequests}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ bgcolor: 'error.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rejected
              </Typography>
              <Typography variant="h3">{rejectedRequests}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card sx={{ bgcolor: 'secondary.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Urgent
              </Typography>
              <Typography variant="h3">{urgentRequests}</Typography>
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
            placeholder="Search by title, description, farmer name, or village"
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
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="priority-filter-label">Priority</InputLabel>
                <Select
                  labelId="priority-filter-label"
                  id="priority-filter"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="category-filter-label">Category</InputLabel>
                <Select
                  labelId="category-filter-label"
                  id="category-filter"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="request status tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={`All Requests (${totalRequests})`} />
          <Tab 
            label={`Pending (${pendingRequests})`}
            icon={pendingRequests > 0 ? <Badge color="info" variant="dot" /> : null}
            iconPosition="start"
          />
          <Tab 
            label={`In Progress (${inProgressRequests})`} 
            icon={inProgressRequests > 0 ? <Badge color="warning" variant="dot" /> : null}
            iconPosition="start"
          />
          <Tab label={`Resolved (${resolvedRequests})`} />
          <Tab label={`Rejected (${rejectedRequests})`} />
          <Tab 
            label={`Urgent (${urgentRequests})`}
            icon={urgentRequests > 0 ? <Badge color="error" variant="dot" /> : null}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Requests Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="requests table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Farmer</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {request.title}
                        </Typography>
                      </Box>
                      {request.attachments.length > 0 && (
                        <Chip
                          icon={<AttachFileIcon />}
                          label={request.attachments.length}
                          size="small"
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}
                        >
                          {request.farmer.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{request.farmer.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {request.farmer.village}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.status.toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor:
                            request.status === 'pending'
                              ? 'info.main'
                              : request.status === 'in-progress'
                              ? 'warning.main'
                              : request.status === 'resolved'
                              ? 'success.main'
                              : 'error.main',
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.priority.toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor:
                            request.priority === 'low'
                              ? 'success.light'
                              : request.priority === 'medium'
                              ? 'info.light'
                              : request.priority === 'high'
                              ? 'warning.main'
                              : 'error.main',
                          color:
                            request.priority === 'low' || request.priority === 'medium'
                              ? 'text.primary'
                              : 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={new Date(request.createdAt).toLocaleString()}>
                        <Typography variant="body2">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </Typography>
                      </Tooltip>
                      <Typography variant="caption" color="text.secondary">
                        {request.comments.length} comments
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setSelectedRequest(request)
                          setOpenViewDialog(true)
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => {
                          setSelectedRequest(request)
                          setOpenCommentDialog(true)
                        }}
                      >
                        <CommentIcon />
                      </IconButton>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, request)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No requests found matching the criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <ListItem
          button
          onClick={() => {
            handleMenuClose()
            setNewStatus('in-progress')
            setOpenStatusDialog(true)
          }}
        >
          <ListItemIcon>
            <AssignmentIcon color="warning" />
          </ListItemIcon>
          <ListItemText primary="Mark In Progress" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            handleMenuClose()
            setNewStatus('resolved')
            setOpenStatusDialog(true)
          }}
        >
          <ListItemIcon>
            <CheckCircleIcon color="success" />
          </ListItemIcon>
          <ListItemText primary="Mark Resolved" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            handleMenuClose()
            setNewStatus('rejected')
            setOpenStatusDialog(true)
          }}
        >
          <ListItemIcon>
            <CancelIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Mark Rejected" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            handleMenuClose()
            handleSendSMS(
              selectedRequest.farmer._id,
              selectedRequest.farmer.name,
              selectedRequest.farmer.mobileNo
            )
          }}
        >
          <ListItemIcon>
            <MessageIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Send SMS" />
        </ListItem>
        <ListItem
          button
          component="a"
          href={`tel:${selectedRequest?.farmer.mobileNo}`}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <PhoneIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Call Farmer" />
        </ListItem>
      </Menu>

      {/* View Request Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedRequest && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedRequest.title}</Typography>
                <Box>
                  <Chip
                    label={selectedRequest.status.toUpperCase()}
                    size="small"
                    sx={{
                      mr: 1,
                      bgcolor:
                        selectedRequest.status === 'pending'
                          ? 'info.main'
                          : selectedRequest.status === 'in-progress'
                          ? 'warning.main'
                          : selectedRequest.status === 'resolved'
                          ? 'success.main'
                          : 'error.main',
                      color: 'white',
                    }}
                  />
                  <Chip
                    label={selectedRequest.priority.toUpperCase()}
                    size="small"
                    sx={{
                      bgcolor:
                        selectedRequest.priority === 'low'
                          ? 'success.light'
                          : selectedRequest.priority === 'medium'
                          ? 'info.light'
                          : selectedRequest.priority === 'high'
                          ? 'warning.main'
                          : 'error.main',
                      color:
                        selectedRequest.priority === 'low' || selectedRequest.priority === 'medium'
                          ? 'text.primary'
                          : 'white',
                    }}
                  />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle1" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedRequest.description}
                  </Typography>

                  {selectedRequest.attachments.length > 0 && (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        Attachments
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {selectedRequest.attachments.map((attachment, index) => (
                          <Chip
                            key={index}
                            icon={<AttachFileIcon />}
                            label={attachment.fileName}
                            variant="outlined"
                            component="a"
                            href={attachment.filePath}
                            target="_blank"
                            clickable
                          />
                        ))}
                      </Box>
                    </>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" gutterBottom>
                    Comments ({selectedRequest.comments.length})
                  </Typography>

                  {selectedRequest.comments.length > 0 ? (
                    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                      {selectedRequest.comments.map((comment, index) => (
                        <Box
                          key={index}
                          sx={{
                            mb: 2,
                            p: 1.5,
                            borderRadius: 1,
                            bgcolor:
                              comment.postedBy === 'farmer'
                                ? 'grey.100'
                                : comment.postedBy === 'executive'
                                ? 'primary.50'
                                : 'secondary.50',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              mb: 0.5,
                            }}
                          >
                            <Typography variant="subtitle2">
                              {comment.userName}
                              <Chip
                                label={comment.postedBy}
                                size="small"
                                sx={{ ml: 1, height: 20 }}
                                color={
                                  comment.postedBy === 'farmer'
                                    ? 'default'
                                    : comment.postedBy === 'executive'
                                    ? 'primary'
                                    : 'secondary'
                                }
                              />
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(comment.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                          <Typography variant="body2">{comment.text}</Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No comments yet.
                    </Typography>
                  )}

                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value)
                        if (e.target.value.trim()) setCommentError('')
                      }}
                      error={!!commentError}
                      helperText={commentError}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SendIcon />}
                      onClick={handleAddComment}
                      disabled={!comment.trim()}
                    >
                      Send
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Farmer Information
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar
                        sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}
                      >
                        {selectedRequest.farmer.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body1">{selectedRequest.farmer.name}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                      {selectedRequest.farmer.mobileNo}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      Village: {selectedRequest.farmer.village}
                    </Typography>

                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PhoneIcon />}
                        component="a"
                        href={`tel:${selectedRequest.farmer.mobileNo}`}
                      >
                        Call
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<MessageIcon />}
                        onClick={() =>
                          handleSendSMS(
                            selectedRequest.farmer._id,
                            selectedRequest.farmer.name,
                            selectedRequest.farmer.mobileNo
                          )
                        }
                      >
                        SMS
                      </Button>
                    </Box>
                  </Paper>

                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Request Details
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Category:</strong>{' '}
                      {selectedRequest.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Created:</strong>{' '}
                      {new Date(selectedRequest.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Last Updated:</strong>{' '}
                      {new Date(selectedRequest.updatedAt).toLocaleString()}
                    </Typography>
                    {selectedRequest.resolvedDate && (
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Resolved Date:</strong>{' '}
                        {new Date(selectedRequest.resolvedDate).toLocaleString()}
                      </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" gutterBottom>
                      Update Status
                    </Typography>
                    <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                      <InputLabel id="update-status-label">Status</InputLabel>
                      <Select
                        labelId="update-status-label"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        label="Status"
                      >
                        <MenuItem value="">Select Status</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="in-progress">In Progress</MenuItem>
                        <MenuItem value="resolved">Resolved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      size="small"
                      label="Reason (optional)"
                      variant="outlined"
                      value={statusReason}
                      onChange={(e) => setStatusReason(e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleUpdateStatus}
                      disabled={!newStatus}
                    >
                      Update Status
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Add Comment Dialog */}
      <Dialog
        open={openCommentDialog}
        onClose={() => setOpenCommentDialog(false)}
      >
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Add a comment to the request: {selectedRequest?.title}
          </DialogContentText>
          <TextareaAutosize
            minRows={4}
            placeholder="Type your comment here..."
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              borderColor: commentError ? 'red' : '#ccc',
            }}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value)
              if (e.target.value.trim()) setCommentError('')
            }}
          />
          {commentError && (
            <FormHelperText error>{commentError}</FormHelperText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCommentDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddComment}
            color="primary"
            variant="contained"
            disabled={!comment.trim()}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Comment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
      >
        <DialogTitle>
          Update Request Status
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update the status of the request: {selectedRequest?.title}
          </DialogContentText>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Reason for status change (optional)"
            variant="outlined"
            multiline
            rows={3}
            value={statusReason}
            onChange={(e) => setStatusReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            color="primary"
            variant="contained"
          >
            {loading ? <CircularProgress size={24} /> : 'Update Status'}
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

export default RequestManagement