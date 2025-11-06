import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material'
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  MonetizationOn as MonetizationOnIcon,
  Sms as SmsIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import axios from 'axios'
import { format } from 'date-fns'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const ExecutiveDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboardData, setDashboardData] = useState({
    farmerCount: 0,
    requestCounts: {
      pending: 0,
      'in-progress': 0,
      completed: 0,
      rejected: 0,
    },
    recentRequests: [],
    incomeData: {
      totalIncome: 0,
      totalEstimatedIncome: 0,
      avgIncome: 0,
      avgEstimatedIncome: 0,
    },
    recentSMS: [],
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/executive/dashboard')
        setDashboardData(response.data.dashboard)
        setError(null)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    // For demo purposes, simulate API response with mock data
    const simulateApiResponse = () => {
      setTimeout(() => {
        setDashboardData({
          farmerCount: 45,
          requestCounts: {
            pending: 12,
            'in-progress': 8,
            completed: 25,
            rejected: 3,
          },
          recentRequests: [
            {
              _id: 'req1',
              title: 'Fertilizer Request',
              description: 'Need fertilizer for paddy field',
              status: 'pending',
              createdAt: new Date(Date.now() - 86400000),
              farmer: {
                name: 'Ramesh Kumar',
                villageName: 'Greenville',
              },
            },
            {
              _id: 'req2',
              title: 'Irrigation Issue',
              description: 'Water pump not working properly',
              status: 'in-progress',
              createdAt: new Date(Date.now() - 172800000),
              farmer: {
                name: 'Suresh Patel',
                villageName: 'Riverside',
              },
            },
            {
              _id: 'req3',
              title: 'Pest Control',
              description: 'Crops affected by pests',
              status: 'completed',
              createdAt: new Date(Date.now() - 259200000),
              farmer: {
                name: 'Mahesh Singh',
                villageName: 'Hillside',
              },
            },
          ],
          incomeData: {
            totalIncome: 450000,
            totalEstimatedIncome: 520000,
            avgIncome: 10000,
            avgEstimatedIncome: 11555,
          },
          recentSMS: [
            {
              message: 'Weather alert: Heavy rain expected tomorrow',
              sentTo: ['9876543210', '9876543211', '9876543212'],
              timestamp: new Date(Date.now() - 86400000),
            },
            {
              message: 'Reminder: Fertilizer application due this week',
              sentTo: ['9876543210', '9876543211'],
              timestamp: new Date(Date.now() - 172800000),
            },
          ],
        })
        setLoading(false)
      }, 1000)
    }

    // Use mock data for demo
    simulateApiResponse()
    // In production, use the actual API call
    // fetchDashboardData()
  }, [])

  // Chart configurations
  const requestChartData = {
    labels: ['Pending', 'In Progress', 'Completed', 'Rejected'],
    datasets: [
      {
        label: 'Requests by Status',
        data: [
          dashboardData.requestCounts.pending,
          dashboardData.requestCounts['in-progress'],
          dashboardData.requestCounts.completed,
          dashboardData.requestCounts.rejected,
        ],
        backgroundColor: [
          'rgba(255, 193, 7, 0.6)',
          'rgba(33, 150, 243, 0.6)',
          'rgba(76, 175, 80, 0.6)',
          'rgba(244, 67, 54, 0.6)',
        ],
        borderColor: [
          'rgba(255, 193, 7, 1)',
          'rgba(33, 150, 243, 1)',
          'rgba(76, 175, 80, 1)',
          'rgba(244, 67, 54, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const incomeChartData = {
    labels: ['Actual Income', 'Estimated Income'],
    datasets: [
      {
        label: 'Income Comparison',
        data: [
          dashboardData.incomeData.totalIncome,
          dashboardData.incomeData.totalEstimatedIncome,
        ],
        backgroundColor: ['rgba(76, 175, 80, 0.6)', 'rgba(255, 193, 7, 0.6)'],
        borderColor: ['rgba(76, 175, 80, 1)', 'rgba(255, 193, 7, 1)'],
        borderWidth: 1,
      },
    ],
  }

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Chip
            icon={<PendingIcon />}
            label="Pending"
            size="small"
            color="warning"
          />
        )
      case 'in-progress':
        return (
          <Chip
            icon={<HourglassEmptyIcon />}
            label="In Progress"
            size="small"
            color="primary"
          />
        )
      case 'completed':
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Completed"
            size="small"
            color="success"
          />
        )
      case 'rejected':
        return (
          <Chip
            icon={<CancelIcon />}
            label="Rejected"
            size="small"
            color="error"
          />
        )
      default:
        return <Chip label={status} size="small" />
    }
  }

  if (loading) {
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
        Executive Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Farmers
                  </Typography>
                  <Typography variant="h4">{dashboardData.farmerCount}</Typography>
                </Box>
                <PeopleIcon
                  sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Pending Requests
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.requestCounts.pending}
                  </Typography>
                </Box>
                <AssignmentIcon
                  sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Income
                  </Typography>
                  <Typography variant="h4">
                    ₹{(dashboardData.incomeData.totalIncome / 1000).toFixed(0)}K
                  </Typography>
                </Box>
                <MonetizationOnIcon
                  sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    SMS Sent
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.recentSMS.length}
                  </Typography>
                </Box>
                <SmsIcon
                  sx={{ fontSize: 40, color: 'info.main', opacity: 0.7 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Lists */}
      <Grid container spacing={3}>
        {/* Request Status Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Request Status
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <Pie data={requestChartData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>

        {/* Income Comparison */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Income Comparison
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              <Bar
                data={incomeChartData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `₹${value / 1000}K`,
                      },
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Recent Requests */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Requests
            </Typography>
            <List>
              {dashboardData.recentRequests.length > 0 ? (
                dashboardData.recentRequests.map((request) => (
                  <ListItem key={request._id} divider>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant="subtitle2">{request.title}</Typography>
                          {getStatusChip(request.status)}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {request.description}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}
                          >
                            <span>
                              {request.farmer.name} ({request.farmer.villageName})
                            </span>
                            <span>
                              {format(new Date(request.createdAt), 'dd MMM yyyy')}
                            </span>
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No recent requests found" />
                </ListItem>
              )}
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                size="small"
                component="a"
                href="/executive/requests"
              >
                View All Requests
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent SMS */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent SMS
            </Typography>
            <List>
              {dashboardData.recentSMS.length > 0 ? (
                dashboardData.recentSMS.map((sms, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={sms.message}
                      secondary={
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mt: 1,
                          }}
                        >
                          <Typography variant="caption">
                            Sent to {sms.sentTo.length} farmers
                          </Typography>
                          <Typography variant="caption">
                            {format(new Date(sms.timestamp), 'dd MMM yyyy')}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No recent SMS found" />
                </ListItem>
              )}
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                size="small"
                component="a"
                href="/executive/sms"
              >
                Send New SMS
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ExecutiveDashboard