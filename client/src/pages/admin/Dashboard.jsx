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
} from '@mui/material'
import {
  People as PeopleIcon,
  Person as PersonIcon,
  Agriculture as AgricultureIcon,
  MonetizationOn as MonetizationOnIcon,
  Co2 as Co2Icon,
  Business as BusinessIcon,
  Download as DownloadIcon,
} from '@mui/icons-material'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import axios from 'axios'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [analytics, setAnalytics] = useState({
    farmerCount: 0,
    executiveCount: 0,
    plantCount: 0,
    totalRevenue: 0,
    carbonCredits: 0,
    partnerCompanies: 0,
    incomeData: {
      estimated: [],
      actual: [],
      months: [],
    },
    regionData: {
      labels: [],
      data: [],
    },
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/admin/analytics/dashboard')
        setAnalytics(response.data.data) // Access the data property from the response
        setError(null)
      } catch (err) {
        console.error('Error fetching analytics:', err)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    // Use mock data for demo
    // simulateApiResponse()
    // In production, use the actual API call
    fetchAnalytics()
  }, [])

  const handleGenerateReport = async () => {
    try {
      const response = await axios.post('/api/admin/report', {}, { responseType: 'blob' })

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `agricultural-report-${new Date().toISOString().split('T')[0]}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error('Error generating report:', err)
      alert('Failed to generate report. Please try again later.')
    }
  }

  // Chart configurations
  const incomeChartData = {
    labels: analytics.incomeData.months,
    datasets: [
      {
        label: 'Estimated Income',
        data: analytics.incomeData.estimated,
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        borderColor: 'rgba(255, 193, 7, 1)',
        borderWidth: 1,
      },
      {
        label: 'Actual Income',
        data: analytics.incomeData.actual,
        backgroundColor: 'rgba(46, 125, 50, 0.2)',
        borderColor: 'rgba(46, 125, 50, 1)',
        borderWidth: 1,
      },
    ],
  }

  const regionChartData = {
    labels: analytics.regionData.labels,
    datasets: [
      {
        label: 'Farmers by Region',
        data: analytics.regionData.data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mb: 2,
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0 }}>
              Admin Dashboard
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleGenerateReport}
              sx={{
                minWidth: { xs: '100%', sm: 'auto' },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Generate Report
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                Report
              </Box>
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <PeopleIcon
                sx={{ fontSize: 48, color: 'primary.main', mb: 1 }}
              />
              <Typography variant="h5" component="div">
                {analytics.farmerCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Farmers
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <PersonIcon
                sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }}
              />
              <Typography variant="h5" component="div">
                {analytics.executiveCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Executives
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <AgricultureIcon
                sx={{ fontSize: 48, color: 'success.main', mb: 1 }}
              />
              <Typography variant="h5" component="div">
                {(analytics.plantCount || 12500).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Plants
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <MonetizationOnIcon
                sx={{ fontSize: 48, color: 'info.main', mb: 1 }}
              />
              <Typography variant="h5" component="div">
                ₹{(analytics.totalRevenue || 1250000).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Co2Icon
                sx={{ fontSize: 48, color: 'success.light', mb: 1 }}
              />
              <Typography variant="h5" component="div">
                {analytics.carbonCredits.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Carbon Credits
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <BusinessIcon
                sx={{ fontSize: 48, color: 'warning.main', mb: 1 }}
              />
              <Typography variant="h5" component="div">
                {analytics.partnerCompanies}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Partner Companies
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Income Comparison (Estimated vs Actual)
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line
                data={incomeChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `₹${value.toLocaleString()}`,
                      },
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Farmers by Region
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie
                data={regionChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboard