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
  TextareaAutosize,
  FormHelperText,
  Stack,
} from '@mui/material'
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Comment as CommentIcon,
  Assignment as AssignmentIcon,
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
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
  const [openNewRequestDialog, setOpenNewRequestDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState('')
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
  })
  const [newRequestErrors, setNewRequestErrors] = useState({
    title: '',
    description: '',
    category: '',
  })
  const [files, setFiles] = useState([])
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
      const response = await axios.get('/api/farmer/requests')
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
            attachments: [],
            comments: [
              {
                text: 'I need approximately ₹15,000 for seeds.',
                postedBy: 'farmer',
                userId: '1',
                userName: 'Rajesh Kumar',
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
                userId: '1',
                userName: 'Rajesh Kumar',
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
            status: 'rejected',
            priority: 'low',
            category: 'training-request',
            createdAt: '2023-06-12T13:45:00.000Z',
            updatedAt: '2023-06-14T09:30:00.000Z',
            attachments: [],
            comments: [
              {
                text: 'Currently we don\'t have organic farming training scheduled in your area. We\'ll consider this for future programs.',
                postedBy: 'executive',
                userId: '1',
                userName: 'John Doe',
                createdAt: '2023-06-14T09:30:00.000Z',
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
      await axios.post(`/api/farmer/requests/${selectedRequest._id}/comment`, {
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
                postedBy: 'farmer',
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
            postedBy: 'farmer',
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

  const handleCreateRequest = async () => {
    // Validate form
    const errors = {}
    if (!newRequest.title.trim()) errors.title = 'Title is required'
    if (!newRequest.description.trim()) errors.description = 'Description is required'
    if (!newRequest.category) errors.category = 'Category is required'

    if (Object.keys(errors).length > 0) {
      setNewRequestErrors(errors)
      return
    }

    try {
      setLoading(true)

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('title', newRequest.title)
      formData.append('description', newRequest.description)
      formData.append('category', newRequest.category)
      formData.append('priority', newRequest.priority)

      // Append files if any
      files.forEach((file) => {
        formData.append('attachments', file)
      })

      await axios.post('/api/farmer/requests', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Simulate API response for demo
      const newRequestObj = {
        _id: `temp-${Date.now()}`,
        ...newRequest,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attachments: files.map((file) => ({
          fileName: file.name,
          filePath: URL.createObjectURL(file),
          fileType: file.type,
          uploadDate: new Date().toISOString(),
        })),
        comments: [],
      }

      setRequests([newRequestObj, ...requests])
      setOpenNewRequestDialog(false)
      setNewRequest({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
      })
      setNewRequestErrors({
        title: '',
        description: '',
        category: '',
      })
      setFiles([])
      setSnackbar({
        open: true,
        message: 'Request created successfully!',
        severity: 'success',
      })
    } catch (err) {
      console.error('Error creating request:', err)
      setSnackbar({
        open: true,
        message: 'Failed to create request. Please try again.',
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles([...files, ...selectedFiles])
  }

  const handleRemoveFile = (index) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleNewRequestChange = (e) => {
    const { name, value } = e.target
    setNewRequest({ ...newRequest, [name]: value })
    
    // Clear error when user types
    if (newRequestErrors[name]) {
      setNewRequestErrors({ ...newRequestErrors, [name]: '' })
    }
  }

  // Filter requests based on search term, status, and tab value
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus ? request.status === filterStatus : true

    const matchesTab =
      (tabValue === 0) || // All
      (tabValue === 1 && request.status === 'pending') || // Pending
      (tabValue === 2 && request.status === 'in-progress') || // In Progress
      (tabValue === 3 && request.status === 'resolved') || // Resolved
      (tabValue === 4 && request.status === 'rejected') // Rejected

    return matchesSearch && matchesStatus && matchesTab
  })

  // Calculate statistics
  const totalRequests = requests.length
  const pendingRequests = requests.filter((req) => req.status === 'pending').length
  const inProgressRequests = requests.filter((req) => req.status === 'in-progress').length
  const resolvedRequests = requests.filter((req) => req.status === 'resolved').length
  const rejectedRequests = requests.filter((req) => req.status === 'rejected').length

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
          My Requests
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenNewRequestDialog(true)}
        >
          New Request
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total
              </Typography>
              <Typography variant="h3">{totalRequests}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h3">{pendingRequests}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h3">{inProgressRequests}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resolved
              </Typography>
              <Typography variant="h3">{resolvedRequests}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by title, description, or category"
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
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="status-filter-label">Filter by Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Filter by Status"
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
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
          <Tab label={`Pending (${pendingRequests})`} />
          <Tab label={`In Progress (${inProgressRequests})`} />
          <Tab label={`Resolved (${resolvedRequests})`} />
          <Tab label={`Rejected (${rejectedRequests})`} />
        </Tabs>
      </Box>

      {/* Requests Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="requests table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
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
                      <Typography variant="body2">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </Typography>
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
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No requests found matching the criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, mb: 2 }}>
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
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Status Timeline
                    </Typography>
                    <Box sx={{ ml: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: 'success.main',
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2">
                          Created on {new Date(selectedRequest.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      {selectedRequest.comments
                        .filter(comment => comment.postedBy === 'executive')
                        .map((comment, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: 'warning.main',
                                mr: 1,
                              }}
                            />
                            <Typography variant="body2">
                              Executive response on {new Date(comment.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        ))}
                      {selectedRequest.resolvedDate && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              bgcolor:
                                selectedRequest.status === 'resolved'
                                  ? 'success.main'
                                  : 'error.main',
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2">
                            {selectedRequest.status === 'resolved' ? 'Resolved' : 'Rejected'} on{' '}
                            {new Date(selectedRequest.resolvedDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

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
            Add a comment to your request: {selectedRequest?.title}
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

      {/* New Request Dialog */}
      <Dialog
        open={openNewRequestDialog}
        onClose={() => setOpenNewRequestDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Request</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={newRequest.title}
                onChange={handleNewRequestChange}
                error={!!newRequestErrors.title}
                helperText={newRequestErrors.title}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={newRequest.description}
                onChange={handleNewRequestChange}
                multiline
                rows={4}
                error={!!newRequestErrors.description}
                helperText={newRequestErrors.description}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!newRequestErrors.category} required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={newRequest.category}
                  onChange={handleNewRequestChange}
                  label="Category"
                >
                  <MenuItem value="">Select a category</MenuItem>
                  <MenuItem value="technical-support">Technical Support</MenuItem>
                  <MenuItem value="financial-assistance">Financial Assistance</MenuItem>
                  <MenuItem value="crop-disease">Crop Disease</MenuItem>
                  <MenuItem value="irrigation-issue">Irrigation Issue</MenuItem>
                  <MenuItem value="equipment-problem">Equipment Problem</MenuItem>
                  <MenuItem value="market-access">Market Access</MenuItem>
                  <MenuItem value="training-request">Training Request</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {newRequestErrors.category && (
                  <FormHelperText>{newRequestErrors.category}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  name="priority"
                  value={newRequest.priority}
                  onChange={handleNewRequestChange}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Attachments
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Upload Files
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </Button>
              {files.length > 0 && (
                <Stack spacing={1}>
                  {files.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachFileIcon sx={{ mr: 1 }} />
                        <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
                          {file.name}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewRequestDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateRequest}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Request'}
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