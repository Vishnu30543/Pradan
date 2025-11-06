import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Divider,
} from '@mui/material'
import {
  MonetizationOn as MonetizationOnIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Co2 as Co2Icon,
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

const AdminAnalytics = () => {
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [revenueData, setRevenueData] = useState(null)
  const [farmerData, setFarmerData] = useState(null)
  const [executiveData, setExecutiveData] = useState(null)
  const [requestData, setRequestData] = useState(null)
  const [carbonData, setCarbonData] = useState(null)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch data based on current tab
        let endpoint = '';
        switch (tabValue) {
          case 0:
            endpoint = '/api/admin/analytics/revenue';
            break;
          case 1:
            endpoint = '/api/admin/analytics/farmers';
            break;
          case 2:
            endpoint = '/api/admin/analytics/executives';
            break;
          case 3:
            endpoint = '/api/admin/analytics/requests';
            break;
          case 4:
            endpoint = '/api/admin/analytics/carbon-credits';
            break;
          default:
            endpoint = '/api/admin/analytics/revenue';
        }

        const response = await axios.get(endpoint);
        
        // Update state based on the tab
        switch (tabValue) {
          case 0:
            setRevenueData(response.data.data);
            break;
          case 1:
            setFarmerData(response.data.data);
            break;
          case 2:
            setExecutiveData(response.data.data);
            break;
          case 3:
            setRequestData(response.data.data);
            break;
          case 4:
            setCarbonData(response.data.data);
            break;
          default:
            setRevenueData(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // For demo purposes, simulate API response with mock data
    const simulateApiResponse = () => {
      setTimeout(() => {
        setLoading(false);
        
        // Mock data for each tab
        const mockRevenueData = {
          monthlyRevenue: [
            { month: 'Jan', income: 12500, estimatedIncome: 15000 },
            { month: 'Feb', income: 13200, estimatedIncome: 16000 },
            { month: 'Mar', income: 14800, estimatedIncome: 17500 },
            { month: 'Apr', income: 15300, estimatedIncome: 18000 },
            { month: 'May', income: 16700, estimatedIncome: 19500 },
            { month: 'Jun', income: 18200, estimatedIncome: 21000 }
          ],
          totalRevenue: 90700,
          totalEstimatedRevenue: 107000,
          growthRate: 8.5
        };
        
        const mockFarmerData = {
          regionDistribution: [
            { region: 'North District', count: 45 },
            { region: 'South District', count: 38 },
            { region: 'East District', count: 27 },
            { region: 'West District', count: 22 },
            { region: 'Central District', count: 18 }
          ],
          cropDistribution: [
            { crop: 'Rice', count: 45 },
            { crop: 'Wheat', count: 38 },
            { crop: 'Sugarcane', count: 27 },
            { crop: 'Cotton', count: 22 },
            { crop: 'Pulses', count: 18 }
          ],
          newFarmersThisMonth: 12,
          activeFarmers: 120
        };
        
        const mockExecutiveData = {
          executivePerformance: [
            { name: 'Rahul Sharma', region: 'North', farmerCount: 28, requestsResolved: 45, avgResponseTime: '12 hours' },
            { name: 'Priya Singh', region: 'South', farmerCount: 24, requestsResolved: 38, avgResponseTime: '14 hours' },
            { name: 'Amit Kumar', region: 'East', farmerCount: 22, requestsResolved: 32, avgResponseTime: '16 hours' },
            { name: 'Neha Patel', region: 'West', farmerCount: 20, requestsResolved: 28, avgResponseTime: '18 hours' },
            { name: 'Vikram Reddy', region: 'Central', farmerCount: 18, requestsResolved: 25, avgResponseTime: '20 hours' }
          ],
          totalExecutives: 12,
          activeExecutives: 10
        };
        
        const mockRequestData = {
          requestByStatus: {
            pending: 35,
            'in-progress': 42,
            completed: 78,
            rejected: 15
          },
          requestByType: [
            { type: 'Technical Support', count: 35 },
            { type: 'Financial Assistance', count: 28 },
            { type: 'Crop Disease', count: 22 },
            { type: 'Equipment', count: 15 },
            { type: 'Other', count: 10 }
          ],
          monthlyTrends: [
            { month: 'Jan', requests: 25 },
            { month: 'Feb', requests: 32 },
            { month: 'Mar', requests: 28 },
            { month: 'Apr', requests: 35 },
            { month: 'May', requests: 42 },
            { month: 'Jun', requests: 38 }
          ],
          avgResolutionTime: '36 hours',
          satisfactionRate: '85%'
        };
        
        const mockCarbonData = {
          totalCredits: 1650,
          monthlyCredits: [
            { month: 'Jan', credits: 180 },
            { month: 'Feb', credits: 210 },
            { month: 'Mar', credits: 195 },
            { month: 'Apr', credits: 225 },
            { month: 'May', credits: 240 },
            { month: 'Jun', credits: 260 }
          ],
          creditsByRegion: [
            { region: 'North', credits: 450 },
            { region: 'South', credits: 380 },
            { region: 'East', credits: 320 },
            { region: 'West', credits: 290 },
            { region: 'Central', credits: 210 }
          ],
          carbonFootprintReduction: '28%',
          projectedAnnualCredits: 3200
        };
        
        // Set data based on current tab
        switch (tabValue) {
          case 0:
            setRevenueData(mockRevenueData);
            break;
          case 1:
            setFarmerData(mockFarmerData);
            break;
          case 2:
            setExecutiveData(mockExecutiveData);
            break;
          case 3:
            setRequestData(mockRequestData);
            break;
          case 4:
            setCarbonData(mockCarbonData);
            break;
          default:
            setRevenueData(mockRevenueData);
        }
      }, 1000);
    };

    // Use mock data for demo
    simulateApiResponse();
    // In production, use the actual API call
    // fetchAnalyticsData();
  }, [tabValue]);

  // Render Revenue Analytics
  const renderRevenueAnalytics = () => {
    if (!revenueData) return null;

    const chartData = {
      labels: revenueData.monthlyRevenue.map(item => item.month),
      datasets: [
        {
          label: 'Actual Income',
          data: revenueData.monthlyRevenue.map(item => item.income),
          backgroundColor: 'rgba(46, 125, 50, 0.2)',
          borderColor: 'rgba(46, 125, 50, 1)',
          borderWidth: 1,
        },
        {
          label: 'Estimated Income',
          data: revenueData.monthlyRevenue.map(item => item.estimatedIncome),
          backgroundColor: 'rgba(255, 193, 7, 0.2)',
          borderColor: 'rgba(255, 193, 7, 1)',
          borderWidth: 1,
        },
      ],
    };

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Monthly Revenue Trends
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line
                data={chartData}
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" color="primary">
                    ₹{revenueData.totalRevenue.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Estimated Revenue
                  </Typography>
                  <Typography variant="h4" color="secondary">
                    ₹{revenueData.totalEstimatedRevenue.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Growth Rate
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {revenueData.growthRate}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  // Render Farmer Analytics
  const renderFarmerAnalytics = () => {
    if (!farmerData) return null;

    const regionChartData = {
      labels: farmerData.regionDistribution.map(item => item.region),
      datasets: [
        {
          label: 'Farmers by Region',
          data: farmerData.regionDistribution.map(item => item.count),
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
    };

    const cropChartData = {
      labels: farmerData.cropDistribution.map(item => item.crop),
      datasets: [
        {
          label: 'Farmers by Crop',
          data: farmerData.cropDistribution.map(item => item.count),
          backgroundColor: [
            'rgba(46, 125, 50, 0.6)',
            'rgba(156, 39, 176, 0.6)',
            'rgba(255, 152, 0, 0.6)',
            'rgba(3, 169, 244, 0.6)',
            'rgba(233, 30, 99, 0.6)',
          ],
          borderColor: [
            'rgba(46, 125, 50, 1)',
            'rgba(156, 39, 176, 1)',
            'rgba(255, 152, 0, 1)',
            'rgba(3, 169, 244, 1)',
            'rgba(233, 30, 99, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Active Farmers
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {farmerData.activeFarmers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    New Farmers This Month
                  </Typography>
                  <Typography variant="h4" color="secondary">
                    {farmerData.newFarmersThisMonth}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Farmers by Crop
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie
                data={cropChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  // Render Executive Analytics
  const renderExecutiveAnalytics = () => {
    if (!executiveData) return null;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Executive Performance
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Region</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Farmers</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Requests Resolved</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Avg. Response Time</th>
                  </tr>
                </thead>
                <tbody>
                  {executiveData.executivePerformance.map((exec, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid #ddd' }}>{exec.name}</td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid #ddd' }}>{exec.region}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>{exec.farmerCount}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>{exec.requestsResolved}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>{exec.avgResponseTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Executives
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {executiveData.totalExecutives}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Active Executives
                  </Typography>
                  <Typography variant="h4" color="secondary">
                    {executiveData.activeExecutives}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  // Render Request Analytics
  const renderRequestAnalytics = () => {
    if (!requestData) return null;

    const statusChartData = {
      labels: Object.keys(requestData.requestByStatus).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
      datasets: [
        {
          label: 'Requests by Status',
          data: Object.values(requestData.requestByStatus),
          backgroundColor: [
            'rgba(255, 152, 0, 0.6)', // Pending
            'rgba(3, 169, 244, 0.6)', // In-progress
            'rgba(46, 125, 50, 0.6)', // Completed
            'rgba(233, 30, 99, 0.6)', // Rejected
          ],
          borderColor: [
            'rgba(255, 152, 0, 1)',
            'rgba(3, 169, 244, 1)',
            'rgba(46, 125, 50, 1)',
            'rgba(233, 30, 99, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    const typeChartData = {
      labels: requestData.requestByType.map(item => item.type),
      datasets: [
        {
          label: 'Requests by Type',
          data: requestData.requestByType.map(item => item.count),
          backgroundColor: 'rgba(63, 81, 181, 0.6)',
          borderColor: 'rgba(63, 81, 181, 1)',
          borderWidth: 1,
        },
      ],
    };

    const trendChartData = {
      labels: requestData.monthlyTrends.map(item => item.month),
      datasets: [
        {
          label: 'Monthly Request Trends',
          data: requestData.monthlyTrends.map(item => item.requests),
          backgroundColor: 'rgba(156, 39, 176, 0.2)',
          borderColor: 'rgba(156, 39, 176, 1)',
          borderWidth: 1,
          tension: 0.4,
        },
      ],
    };

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Requests by Status
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie
                data={statusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Requests by Type
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                data={typeChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Average Resolution Time
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {requestData.avgResolutionTime}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Satisfaction Rate
                  </Typography>
                  <Typography variant="h4" color="secondary">
                    {requestData.satisfactionRate}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Request Trends
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line
                data={trendChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  // Render Carbon Credit Analytics
  const renderCarbonCreditAnalytics = () => {
    if (!carbonData) return null;

    const monthlyChartData = {
      labels: carbonData.monthlyCredits.map(item => item.month),
      datasets: [
        {
          label: 'Monthly Carbon Credits',
          data: carbonData.monthlyCredits.map(item => item.credits),
          backgroundColor: 'rgba(46, 125, 50, 0.2)',
          borderColor: 'rgba(46, 125, 50, 1)',
          borderWidth: 1,
          tension: 0.4,
        },
      ],
    };

    const regionChartData = {
      labels: carbonData.creditsByRegion.map(item => item.region),
      datasets: [
        {
          label: 'Carbon Credits by Region',
          data: carbonData.creditsByRegion.map(item => item.credits),
          backgroundColor: [
            'rgba(46, 125, 50, 0.6)',
            'rgba(156, 39, 176, 0.6)',
            'rgba(255, 152, 0, 0.6)',
            'rgba(3, 169, 244, 0.6)',
            'rgba(233, 30, 99, 0.6)',
          ],
          borderColor: [
            'rgba(46, 125, 50, 1)',
            'rgba(156, 39, 176, 1)',
            'rgba(255, 152, 0, 1)',
            'rgba(3, 169, 244, 1)',
            'rgba(233, 30, 99, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Monthly Carbon Credits
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line
                data={monthlyChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Carbon Credits
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {carbonData.totalCredits.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Carbon Footprint Reduction
                  </Typography>
                  <Typography variant="h4" color="secondary">
                    {carbonData.carbonFootprintReduction}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Projected Annual Credits
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {carbonData.projectedAnnualCredits.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Carbon Credits by Region
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
    );
  };

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
    );
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
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<MonetizationOnIcon />} label="Revenue" />
          <Tab icon={<PeopleIcon />} label="Farmers" />
          <Tab icon={<PersonIcon />} label="Executives" />
          <Tab icon={<AssignmentIcon />} label="Requests" />
          <Tab icon={<Co2Icon />} label="Carbon Credits" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ mt: 3 }}>
        {tabValue === 0 && renderRevenueAnalytics()}
        {tabValue === 1 && renderFarmerAnalytics()}
        {tabValue === 2 && renderExecutiveAnalytics()}
        {tabValue === 3 && renderRequestAnalytics()}
        {tabValue === 4 && renderCarbonCreditAnalytics()}
      </Box>
    </Box>
  );
};

export default AdminAnalytics;