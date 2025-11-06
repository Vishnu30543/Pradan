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
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material'
import axios from 'axios'

const ExecutiveManagement = () => {
  const [executives, setExecutives] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [selectedExecutive, setSelectedExecutive] = useState(null)
  const [newExecutive, setNewExecutive] = useState({
    name: '',
    email: '',
    password: '',
    phno: '',
    region: '',
  })
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  useEffect(() => {
    fetchExecutives()
  }, [])

  const fetchExecutives = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/admin/executives')
      setExecutives(response.data.executives)
      setError(null)
    } catch (err) {
      console.error('Error fetching executives:', err)
      setError('Failed to load executives. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // For demo purposes, simulate API response with mock data
  useEffect(() => {
    const simulateApiResponse = () => {
      setTimeout(() => {
        setExecutives([
          {
            _id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phno: '9876543210',
            region: 'North',
            assignedFarmers: 42,
            createdAt: '2023-01-15T10:30:00.000Z',
          },
          {
            _id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phno: '8765432109',
            region: 'South',
            assignedFarmers: 38,
            createdAt: '2023-02-20T14:45:00.000Z',
          },
          {
            _id: '3',
            name: 'Robert Johnson',
            email: 'robert.johnson@example.com',
            phno: '7654321098',
            region: 'East',
            assignedFarmers: 56,
            createdAt: '2023-03-10T09:15:00.000Z',
          },
          {
            _id: '4',
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            phno: '6543210987',
            region: 'West',
            assignedFarmers: 29,
            createdAt: '2023-04-05T11:20:00.000Z',
          },
          {
            _id: '5',
            name: 'Michael Wilson',
            email: 'michael.wilson@example.com',
            phno: '5432109876',
            region: 'Central',
            assignedFarmers: 47,
            createdAt: '2023-05-18T16:30:00.000Z',
          },
        ])
        setLoading(false)
      }, 1000)
    }

    // Use mock data for demo
    simulateApiResponse()
    // In production, use the actual API call
    // fetchExecutives()
  }, [])

  const handleAddExecutive = async () => {
    try {
      setLoading(true)
      const response = await axios.post('/api/admin/executive', newExecutive)
      
      // In a real app, we would use the response data
      // For demo, we'll simulate adding to the list
      const mockNewExecutive = {
        ...newExecutive,
        _id: Date.now().toString(),
        assignedFarmers: 0,
        createdAt: new Date().toISOString(),
      }
      
      setExecutives([...executives, mockNewExecutive])
      setOpenAddDialog(false)
      setNewExecutive({
        name: '',
        email: '',
        password: '',
        phno: '',
        region: '',
      })
      setSnackbar({
        open: true,
        message: 'Executive added successfully!',
        severity: 'success',
      })
    } catch (err) {
      console.error('Error adding executive:', err)
      setSnackbar({
        open: true,
        message: 'Failed to add executive. Please try again.',
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteExecutive = async () => {
    if (!selectedExecutive) return

    try {
      setLoading(true)
      await axios.delete(`/api/admin/executive/${selectedExecutive._id}`)
      
      // Update the local state by filtering out the deleted executive
      setExecutives(executives.filter(exec => exec._id !== selectedExecutive._id))
      setOpenDeleteDialog(false)
      setSelectedExecutive(null)
      setSnackbar({
        open: true,
        message: 'Executive deleted successfully!',
        severity: 'success',
      })
    } catch (err) {
      console.error('Error deleting executive:', err)
      setSnackbar({
        open: true,
        message: 'Failed to delete executive. Please try again.',
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewExecutive({ ...newExecutive, [name]: value })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  if (loading && executives.length === 0) {
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
          Executive Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
        >
          Add Executive
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Executives
              </Typography>
              <Typography variant="h3">{executives.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Regions
              </Typography>
              <Typography variant="h3">
                {new Set(executives.map(exec => exec.region)).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Farmers Managed
              </Typography>
              <Typography variant="h3">
                {executives.reduce((sum, exec) => sum + exec.assignedFarmers, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Avg. Farmers per Executive
              </Typography>
              <Typography variant="h3">
                {executives.length > 0
                  ? Math.round(
                      executives.reduce(
                        (sum, exec) => sum + exec.assignedFarmers,
                        0
                      ) / executives.length
                    )
                  : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Executives Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="executives table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Region</TableCell>
                <TableCell>Assigned Farmers</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {executives.map((executive) => (
                <TableRow key={executive._id}>
                  <TableCell>{executive.name}</TableCell>
                  <TableCell>{executive.email}</TableCell>
                  <TableCell>{executive.phno}</TableCell>
                  <TableCell>
                    <Chip
                      label={executive.region}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{executive.assignedFarmers}</TableCell>
                  <TableCell>
                    {new Date(executive.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setSelectedExecutive(executive)
                        setOpenViewDialog(true)
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedExecutive(executive)
                        setOpenDeleteDialog(true)
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Executive Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonAddIcon sx={{ mr: 1 }} />
            Add New Executive
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newExecutive.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={newExecutive.email}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newExecutive.password}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="phno"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={newExecutive.phno}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="region"
            label="Region"
            type="text"
            fullWidth
            variant="outlined"
            value={newExecutive.region}
            onChange={handleInputChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddExecutive}
            variant="contained"
            color="primary"
            disabled={
              !newExecutive.name ||
              !newExecutive.email ||
              !newExecutive.password ||
              !newExecutive.phno ||
              !newExecutive.region
            }
          >
            {loading ? <CircularProgress size={24} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Executive Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedExecutive && (
          <>
            <DialogTitle>Executive Details</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">{selectedExecutive.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedExecutive.email}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Phone Number</Typography>
                  <Typography variant="body1">{selectedExecutive.phno}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Region</Typography>
                  <Typography variant="body1">{selectedExecutive.region}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Assigned Farmers</Typography>
                  <Typography variant="body1">{selectedExecutive.assignedFarmers}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Created At</Typography>
                  <Typography variant="body1">
                    {new Date(selectedExecutive.createdAt).toLocaleDateString()}
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

      {/* Delete Executive Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete executive {selectedExecutive?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteExecutive}
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

export default ExecutiveManagement