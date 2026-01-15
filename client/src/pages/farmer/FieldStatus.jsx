import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  CircularProgress,
  Button,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
} from '@mui/material'
import {
  Info as InfoIcon,
  Grass as GrassIcon,
  Opacity as OpacityIcon,
  WbSunny as WbSunnyIcon,
  BugReport as BugReportIcon,
  LocalFlorist as LocalFloristIcon,
  // Eco as EcoIcon,
  Timeline as TimelineIcon,
  ZoomIn as ZoomInIcon,
  CalendarMonth as CalendarMonthIcon,
  CloudDownload as CloudDownloadIcon,
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

// Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
)

const FieldStatus = () => {
  const { user } = useAuth()
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedField, setSelectedField] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedTab, setSelectedTab] = useState(0)

  useEffect(() => {
    // fetchFields()
  }, [])

  const fetchFields = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/farmer/fields')
      setFields(response.data.fields)
      if (response.data.fields.length > 0) {
        setSelectedField(response.data.fields[0])
      }
      setError(null)
    } catch (err) {
      console.error('Error fetching fields:', err)
      setError('Failed to load field data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // For demo purposes, simulate API response with mock data
  useEffect(() => {
    const simulateApiResponse = () => {
      setTimeout(() => {
        const mockFields = [
          {
            _id: '1',
            name: 'North Field',
            crop: 'Wheat',
            area: 2.5,
            location: {
              village: 'Sundarpur',
              coordinates: [25.3176, 82.9739],
            },
            plantingDate: '2022-11-15T00:00:00.000Z',
            expectedHarvestDate: '2023-04-10T00:00:00.000Z',
            status: {
              overall: 'good',
              soilMoisture: 'optimal',
              pestDetection: 'low',
              diseaseDetection: 'none',
              growthStage: 'flowering',
              ndviIndex: 0.78,
              lastUpdated: '2023-03-05T10:30:00.000Z',
            },
            history: [
              {
                date: '2022-12-15T00:00:00.000Z',
                ndviIndex: 0.45,
                soilMoisture: 'optimal',
                pestDetection: 'none',
                diseaseDetection: 'none',
                growthStage: 'seedling',
              },
              {
                date: '2023-01-15T00:00:00.000Z',
                ndviIndex: 0.58,
                soilMoisture: 'high',
                pestDetection: 'none',
                diseaseDetection: 'none',
                growthStage: 'tillering',
              },
              {
                date: '2023-02-15T00:00:00.000Z',
                ndviIndex: 0.72,
                soilMoisture: 'optimal',
                pestDetection: 'low',
                diseaseDetection: 'none',
                growthStage: 'stem extension',
              },
              {
                date: '2023-03-05T00:00:00.000Z',
                ndviIndex: 0.78,
                soilMoisture: 'optimal',
                pestDetection: 'low',
                diseaseDetection: 'none',
                growthStage: 'flowering',
              },
            ],
            images: [
              {
                url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8',
                type: 'satellite',
                date: '2023-03-01T00:00:00.000Z',
                caption: 'Satellite image - March 2023',
              },
              {
                url: 'https://images.unsplash.com/photo-1626585808690-e8df83fb3bf2',
                type: 'drone',
                date: '2023-02-15T00:00:00.000Z',
                caption: 'Drone image - February 2023',
              },
              {
                url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
                type: 'ground',
                date: '2023-03-05T00:00:00.000Z',
                caption: 'Ground image - March 2023',
              },
            ],
            recommendations: [
              {
                type: 'irrigation',
                message:
                  'Maintain current irrigation schedule. Soil moisture levels are optimal.',
                date: '2023-03-05T10:30:00.000Z',
                priority: 'low',
              },
              {
                type: 'pest',
                message:
                  'Monitor for aphids in the coming weeks. Early signs detected.',
                date: '2023-03-05T10:30:00.000Z',
                priority: 'medium',
              },
              {
                type: 'fertilizer',
                message:
                  'Apply nitrogen fertilizer within the next 7 days for optimal flowering stage development.',
                date: '2023-03-05T10:30:00.000Z',
                priority: 'high',
              },
            ],
            weather: {
              current: {
                temperature: 28,
                humidity: 65,
                windSpeed: 8,
                condition: 'Partly Cloudy',
                date: '2023-03-06T00:00:00.000Z',
              },
              forecast: [
                {
                  date: '2023-03-07T00:00:00.000Z',
                  maxTemp: 30,
                  minTemp: 22,
                  condition: 'Sunny',
                  precipitation: 0,
                },
                {
                  date: '2023-03-08T00:00:00.000Z',
                  maxTemp: 31,
                  minTemp: 23,
                  condition: 'Partly Cloudy',
                  precipitation: 10,
                },
                {
                  date: '2023-03-09T00:00:00.000Z',
                  maxTemp: 29,
                  minTemp: 21,
                  condition: 'Light Rain',
                  precipitation: 40,
                },
                {
                  date: '2023-03-10T00:00:00.000Z',
                  maxTemp: 27,
                  minTemp: 20,
                  condition: 'Cloudy',
                  precipitation: 20,
                },
                {
                  date: '2023-03-11T00:00:00.000Z',
                  maxTemp: 28,
                  minTemp: 21,
                  condition: 'Sunny',
                  precipitation: 0,
                },
              ],
            },
          },
          {
            _id: '2',
            name: 'South Field',
            crop: 'Rice',
            area: 2.0,
            location: {
              village: 'Sundarpur',
              coordinates: [25.3150, 82.9720],
            },
            plantingDate: '2022-07-10T00:00:00.000Z',
            expectedHarvestDate: '2022-11-05T00:00:00.000Z',
            status: {
              overall: 'harvested',
              soilMoisture: 'low',
              pestDetection: 'none',
              diseaseDetection: 'none',
              growthStage: 'harvested',
              ndviIndex: 0.2,
              lastUpdated: '2022-11-10T10:30:00.000Z',
            },
            history: [
              {
                date: '2022-08-10T00:00:00.000Z',
                ndviIndex: 0.5,
                soilMoisture: 'high',
                pestDetection: 'none',
                diseaseDetection: 'none',
                growthStage: 'seedling',
              },
              {
                date: '2022-09-10T00:00:00.000Z',
                ndviIndex: 0.7,
                soilMoisture: 'high',
                pestDetection: 'low',
                diseaseDetection: 'none',
                growthStage: 'tillering',
              },
              {
                date: '2022-10-10T00:00:00.000Z',
                ndviIndex: 0.85,
                soilMoisture: 'optimal',
                pestDetection: 'low',
                diseaseDetection: 'none',
                growthStage: 'heading',
              },
              {
                date: '2022-11-05T00:00:00.000Z',
                ndviIndex: 0.2,
                soilMoisture: 'low',
                pestDetection: 'none',
                diseaseDetection: 'none',
                growthStage: 'harvested',
              },
            ],
            images: [
              {
                url: 'https://images.unsplash.com/photo-1594644465539-783d6f6bb37a',
                type: 'satellite',
                date: '2022-10-15T00:00:00.000Z',
                caption: 'Satellite image - October 2022',
              },
              {
                url: 'https://images.unsplash.com/photo-1536632610-7a7c4e4d0626',
                type: 'ground',
                date: '2022-11-01T00:00:00.000Z',
                caption: 'Ground image - November 2022',
              },
            ],
            recommendations: [
              {
                type: 'preparation',
                message:
                  'Prepare field for next planting season. Consider soil testing before next crop.',
                date: '2022-11-10T10:30:00.000Z',
                priority: 'medium',
              },
            ],
            weather: {
              current: {
                temperature: 28,
                humidity: 65,
                windSpeed: 8,
                condition: 'Partly Cloudy',
                date: '2023-03-06T00:00:00.000Z',
              },
              forecast: [
                {
                  date: '2023-03-07T00:00:00.000Z',
                  maxTemp: 30,
                  minTemp: 22,
                  condition: 'Sunny',
                  precipitation: 0,
                },
                {
                  date: '2023-03-08T00:00:00.000Z',
                  maxTemp: 31,
                  minTemp: 23,
                  condition: 'Partly Cloudy',
                  precipitation: 10,
                },
                {
                  date: '2023-03-09T00:00:00.000Z',
                  maxTemp: 29,
                  minTemp: 21,
                  condition: 'Light Rain',
                  precipitation: 40,
                },
                {
                  date: '2023-03-10T00:00:00.000Z',
                  maxTemp: 27,
                  minTemp: 20,
                  condition: 'Cloudy',
                  precipitation: 20,
                },
                {
                  date: '2023-03-11T00:00:00.000Z',
                  maxTemp: 28,
                  minTemp: 21,
                  condition: 'Sunny',
                  precipitation: 0,
                },
              ],
            },
          },
          {
            _id: '3',
            name: 'East Field',
            crop: 'Mustard',
            area: 0.5,
            location: {
              village: 'Sundarpur',
              coordinates: [25.3180, 82.9760],
            },
            plantingDate: '2022-11-01T00:00:00.000Z',
            expectedHarvestDate: '2023-02-15T00:00:00.000Z',
            status: {
              overall: 'attention',
              soilMoisture: 'low',
              pestDetection: 'medium',
              diseaseDetection: 'low',
              growthStage: 'maturity',
              ndviIndex: 0.65,
              lastUpdated: '2023-03-05T10:30:00.000Z',
            },
            history: [
              {
                date: '2022-12-01T00:00:00.000Z',
                ndviIndex: 0.4,
                soilMoisture: 'optimal',
                pestDetection: 'none',
                diseaseDetection: 'none',
                growthStage: 'seedling',
              },
              {
                date: '2023-01-01T00:00:00.000Z',
                ndviIndex: 0.75,
                soilMoisture: 'optimal',
                pestDetection: 'none',
                diseaseDetection: 'none',
                growthStage: 'flowering',
              },
              {
                date: '2023-02-01T00:00:00.000Z',
                ndviIndex: 0.7,
                soilMoisture: 'optimal',
                pestDetection: 'low',
                diseaseDetection: 'none',
                growthStage: 'pod formation',
              },
              {
                date: '2023-03-01T00:00:00.000Z',
                ndviIndex: 0.65,
                soilMoisture: 'low',
                pestDetection: 'medium',
                diseaseDetection: 'low',
                growthStage: 'maturity',
              },
            ],
            images: [
              {
                url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399',
                type: 'satellite',
                date: '2023-02-20T00:00:00.000Z',
                caption: 'Satellite image - February 2023',
              },
              {
                url: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7',
                type: 'drone',
                date: '2023-03-01T00:00:00.000Z',
                caption: 'Drone image - March 2023',
              },
            ],
            recommendations: [
              {
                type: 'irrigation',
                message:
                  'Increase irrigation immediately. Soil moisture levels are low.',
                date: '2023-03-05T10:30:00.000Z',
                priority: 'high',
              },
              {
                type: 'pest',
                message:
                  'Apply recommended pesticide within 2 days. Aphid infestation detected.',
                date: '2023-03-05T10:30:00.000Z',
                priority: 'high',
              },
              {
                type: 'disease',
                message:
                  'Monitor for white rust disease. Early symptoms detected.',
                date: '2023-03-05T10:30:00.000Z',
                priority: 'medium',
              },
            ],
            weather: {
              current: {
                temperature: 28,
                humidity: 65,
                windSpeed: 8,
                condition: 'Partly Cloudy',
                date: '2023-03-06T00:00:00.000Z',
              },
              forecast: [
                {
                  date: '2023-03-07T00:00:00.000Z',
                  maxTemp: 30,
                  minTemp: 22,
                  condition: 'Sunny',
                  precipitation: 0,
                },
                {
                  date: '2023-03-08T00:00:00.000Z',
                  maxTemp: 31,
                  minTemp: 23,
                  condition: 'Partly Cloudy',
                  precipitation: 10,
                },
                {
                  date: '2023-03-09T00:00:00.000Z',
                  maxTemp: 29,
                  minTemp: 21,
                  condition: 'Light Rain',
                  precipitation: 40,
                },
                {
                  date: '2023-03-10T00:00:00.000Z',
                  maxTemp: 27,
                  minTemp: 20,
                  condition: 'Cloudy',
                  precipitation: 20,
                },
                {
                  date: '2023-03-11T00:00:00.000Z',
                  maxTemp: 28,
                  minTemp: 21,
                  condition: 'Sunny',
                  precipitation: 0,
                },
              ],
            },
          },
        ]

        setFields(mockFields)
        setSelectedField(mockFields[0])
        setLoading(false)
      }, 1000)
    }

    // Use mock data for demo
    simulateApiResponse()
    // In production, use the actual API call
    // fetchFields()
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleFieldSelect = (field) => {
    setSelectedField(field)
  }

  const handleImageClick = (image) => {
    setSelectedImage(image)
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
    setSelectedImage(null)
  }

  const handleDialogTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'success.main'
      case 'attention':
        return 'warning.main'
      case 'critical':
        return 'error.main'
      case 'harvested':
        return 'info.main'
      default:
        return 'text.secondary'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'good':
        return 'Good'
      case 'attention':
        return 'Needs Attention'
      case 'critical':
        return 'Critical'
      case 'harvested':
        return 'Harvested'
      default:
        return 'Unknown'
    }
  }

  const getMoistureText = (moisture) => {
    switch (moisture) {
      case 'low':
        return 'Low'
      case 'optimal':
        return 'Optimal'
      case 'high':
        return 'High'
      default:
        return 'Unknown'
    }
  }

  const getMoistureColor = (moisture) => {
    switch (moisture) {
      case 'low':
        return 'warning.main'
      case 'optimal':
        return 'success.main'
      case 'high':
        return 'info.main'
      default:
        return 'text.secondary'
    }
  }

  const getPestLevelText = (level) => {
    switch (level) {
      case 'none':
        return 'None Detected'
      case 'low':
        return 'Low Level'
      case 'medium':
        return 'Medium Level'
      case 'high':
        return 'High Level'
      default:
        return 'Unknown'
    }
  }

  const getPestLevelColor = (level) => {
    switch (level) {
      case 'none':
        return 'success.main'
      case 'low':
        return 'info.main'
      case 'medium':
        return 'warning.main'
      case 'high':
        return 'error.main'
      default:
        return 'text.secondary'
    }
  }

  const getDiseaseLevelText = (level) => {
    switch (level) {
      case 'none':
        return 'None Detected'
      case 'low':
        return 'Low Level'
      case 'medium':
        return 'Medium Level'
      case 'high':
        return 'High Level'
      default:
        return 'Unknown'
    }
  }

  const getDiseaseLevelColor = (level) => {
    switch (level) {
      case 'none':
        return 'success.main'
      case 'low':
        return 'info.main'
      case 'medium':
        return 'warning.main'
      case 'high':
        return 'error.main'
      default:
        return 'text.secondary'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'info'
      case 'medium':
        return 'warning'
      case 'high':
        return 'error'
      default:
        return 'default'
    }
  }

  const getNDVIChartData = (field) => {
    if (!field || !field.history) return null

    const sortedHistory = [...field.history].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    )

    return {
      labels: sortedHistory.map((item) =>
        new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ),
      datasets: [
        {
          label: 'NDVI Index',
          data: sortedHistory.map((item) => item.ndviIndex),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    }
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'NDVI Index Over Time',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `NDVI: ${context.raw.toFixed(2)}`
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 1,
        ticks: {
          callback: function (value) {
            return value.toFixed(1)
          },
        },
      },
    },
  }

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
          onClick={fetchFields}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Box>
    )
  }

  if (fields.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Field Status
        </Typography>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No fields found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You don't have any registered fields yet. Please contact your
            executive to register your fields for monitoring.
          </Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom>
        Field Status
      </Typography>

      {/* Field Selection */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Field
        </Typography>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} md={4} key={field._id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border:
                    selectedField && selectedField._id === field._id
                      ? '2px solid'
                      : '1px solid',
                  borderColor:
                    selectedField && selectedField._id === field._id
                      ? 'primary.main'
                      : 'divider',
                }}
                onClick={() => handleFieldSelect(field)}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6">{field.name}</Typography>
                    <Chip
                      label={getStatusText(field.status.overall)}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(field.status.overall),
                        color: 'white',
                      }}
                    />
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <GrassIcon
                        fontSize="small"
                        sx={{ verticalAlign: 'middle', mr: 0.5 }}
                      />
                      Crop: {field.crop}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <LocalFloristIcon
                        fontSize="small"
                        sx={{ verticalAlign: 'middle', mr: 0.5 }}
                      />
                      Growth Stage: {field.status.growthStage
                        .split(' ')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <CalendarMonthIcon
                        fontSize="small"
                        sx={{ verticalAlign: 'middle', mr: 0.5 }}
                      />
                      Last Updated:{' '}
                      {new Date(field.status.lastUpdated).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {selectedField && (
        <>
          {/* Field Status Overview */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h5">
                {selectedField.name} - {selectedField.crop}
              </Typography>
              <Chip
                label={getStatusText(selectedField.status.overall)}
                sx={{
                  bgcolor: getStatusColor(selectedField.status.overall),
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Field Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Area
                      </Typography>
                      <Typography variant="body1">
                        {selectedField.area} acres
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1">
                        {selectedField.location.village}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Planting Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(
                          selectedField.plantingDate
                        ).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Expected Harvest
                      </Typography>
                      <Typography variant="body1">
                        {new Date(
                          selectedField.expectedHarvestDate
                        ).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Current Status
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Growth Stage
                      </Typography>
                      <Typography variant="body1">
                        {selectedField.status.growthStage
                          .split(' ')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        NDVI Index
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ mr: 1 }}>
                          {selectedField.status.ndviIndex.toFixed(2)}
                        </Typography>
                        <Tooltip title="NDVI (Normalized Difference Vegetation Index) measures plant health. Values range from -1 to 1, with higher values indicating healthier vegetation.">
                          <InfoIcon fontSize="small" color="primary" />
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Soil Moisture
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: getMoistureColor(selectedField.status.soilMoisture) }}
                      >
                        {getMoistureText(selectedField.status.soilMoisture)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {new Date(
                          selectedField.status.lastUpdated
                        ).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Pest Detection
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: getPestLevelColor(
                            selectedField.status.pestDetection
                          ),
                        }}
                      >
                        {getPestLevelText(selectedField.status.pestDetection)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Disease Detection
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: getDiseaseLevelColor(
                            selectedField.status.diseaseDetection
                          ),
                        }}
                      >
                        {getDiseaseLevelText(
                          selectedField.status.diseaseDetection
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  NDVI Trend
                </Typography>
                {getNDVIChartData(selectedField) ? (
                  <Box sx={{ height: 250 }}>
                    <Line
                      data={getNDVIChartData(selectedField)}
                      options={chartOptions}
                    />
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No historical data available
                  </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Weather Forecast
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: 2,
                    pb: 1,
                  }}
                >
                  {selectedField.weather.forecast.map((day, index) => (
                    <Card
                      key={index}
                      sx={{ minWidth: 120, flexShrink: 0, textAlign: 'center' }}
                    >
                      <CardContent sx={{ py: 1 }}>
                        <Typography variant="caption" display="block">
                          {new Date(day.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                          })}
                        </Typography>
                        <WbSunnyIcon
                          color="warning"
                          sx={{ fontSize: 32, my: 0.5 }}
                        />
                        <Typography variant="body2">
                          {day.condition}
                        </Typography>
                        <Typography variant="body2">
                          {day.maxTemp}°C / {day.minTemp}°C
                        </Typography>
                        <Typography variant="caption" display="block">
                          {day.precipitation}% rain
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Tabs for different sections */}
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="field status tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Recommendations" />
                <Tab label="Field Images" />
                <Tab label="Historical Data" />
              </Tabs>
            </Box>

            {/* Recommendations Tab */}
            {tabValue === 0 && (
              <Box sx={{ py: 3 }}>
                {selectedField.recommendations.length > 0 ? (
                  <Grid container spacing={3}>
                    {selectedField.recommendations.map((recommendation, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Paper
                          sx={{
                            p: 2,
                            borderLeft: '4px solid',
                            borderColor: (theme) =>
                              theme.palette[getPriorityColor(recommendation.priority)]
                                .main,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              mb: 1,
                            }}
                          >
                            <Typography variant="subtitle1">
                              {recommendation.type
                                .charAt(0)
                                .toUpperCase() +
                                recommendation.type.slice(1)}{' '}
                              Recommendation
                            </Typography>
                            <Chip
                              label={recommendation.priority.toUpperCase()}
                              size="small"
                              color={getPriorityColor(recommendation.priority)}
                            />
                          </Box>
                          <Typography variant="body2" paragraph>
                            {recommendation.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Issued on{' '}
                            {new Date(recommendation.date).toLocaleDateString()}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info">
                    No recommendations available for this field at the moment.
                  </Alert>
                )}
              </Box>
            )}

            {/* Field Images Tab */}
            {tabValue === 1 && (
              <Box sx={{ py: 3 }}>
                {selectedField.images.length > 0 ? (
                  <Grid container spacing={3}>
                    {selectedField.images.map((image, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                          <CardMedia
                            component="div"
                            sx={{
                              height: 200,
                              backgroundImage: `url(${image.url})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              position: 'relative',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleImageClick(image)}
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'rgba(0, 0, 0, 0.6)',
                                borderRadius: '50%',
                                p: 0.5,
                              }}
                            >
                              <ZoomInIcon sx={{ color: 'white' }} />
                            </Box>
                            <Chip
                              label={image.type.toUpperCase()}
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                bgcolor:
                                  image.type === 'satellite'
                                    ? 'primary.main'
                                    : image.type === 'drone'
                                      ? 'secondary.main'
                                      : 'success.main',
                                color: 'white',
                              }}
                            />
                          </CardMedia>
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                              {image.caption}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Captured on{' '}
                              {new Date(image.date).toLocaleDateString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info">
                    No images available for this field at the moment.
                  </Alert>
                )}
              </Box>
            )}

            {/* Historical Data Tab */}
            {tabValue === 2 && (
              <Box sx={{ py: 3 }}>
                {selectedField.history.length > 0 ? (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Field History
                    </Typography>
                    <Paper sx={{ p: 2, mb: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          NDVI Index History
                        </Typography>
                        <Box sx={{ height: 300 }}>
                          <Line
                            data={getNDVIChartData(selectedField)}
                            options={{
                              ...chartOptions,
                              plugins: {
                                ...chartOptions.plugins,
                                title: {
                                  display: true,
                                  text: 'NDVI Index History',
                                },
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </Paper>

                    <Typography variant="h6" gutterBottom>
                      Detailed History
                    </Typography>
                    <Paper>
                      <Box sx={{ width: '100%', overflow: 'auto' }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Date</TableCell>
                              <TableCell>Growth Stage</TableCell>
                              <TableCell>NDVI Index</TableCell>
                              <TableCell>Soil Moisture</TableCell>
                              <TableCell>Pest Detection</TableCell>
                              <TableCell>Disease Detection</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {[...selectedField.history]
                              .sort(
                                (a, b) =>
                                  new Date(b.date) - new Date(a.date)
                              )
                              .map((record, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    {new Date(record.date).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>
                                    {record.growthStage
                                      .split(' ')
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(' ')}
                                  </TableCell>
                                  <TableCell>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          width: 40,
                                          mr: 1,
                                        }}
                                      >
                                        {record.ndviIndex.toFixed(2)}
                                      </Box>
                                      <LinearProgress
                                        variant="determinate"
                                        value={record.ndviIndex * 100}
                                        sx={{ flexGrow: 1, height: 8, borderRadius: 5 }}
                                      />
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={getMoistureText(record.soilMoisture)}
                                      size="small"
                                      sx={{
                                        bgcolor: getMoistureColor(
                                          record.soilMoisture
                                        ),
                                        color:
                                          record.soilMoisture === 'optimal' ||
                                            record.soilMoisture === 'high'
                                            ? 'white'
                                            : 'inherit',
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={getPestLevelText(record.pestDetection)}
                                      size="small"
                                      sx={{
                                        bgcolor: getPestLevelColor(
                                          record.pestDetection
                                        ),
                                        color:
                                          record.pestDetection === 'medium' ||
                                            record.pestDetection === 'high'
                                            ? 'white'
                                            : 'inherit',
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={getDiseaseLevelText(
                                        record.diseaseDetection
                                      )}
                                      size="small"
                                      sx={{
                                        bgcolor: getDiseaseLevelColor(
                                          record.diseaseDetection
                                        ),
                                        color:
                                          record.diseaseDetection === 'medium' ||
                                            record.diseaseDetection === 'high'
                                            ? 'white'
                                            : 'inherit',
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Paper>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Button
                        variant="outlined"
                        startIcon={<CloudDownloadIcon />}
                        onClick={() => {
                          // In a real app, this would download a CSV or PDF report
                          alert('This would download a detailed field history report')
                        }}
                      >
                        Download Full History Report
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Alert severity="info">
                    No historical data available for this field at the moment.
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        </>
      )}

      {/* Image Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        {selectedImage && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">{selectedImage.caption}</Typography>
                <Chip
                  label={selectedImage.type.toUpperCase()}
                  size="small"
                  sx={{
                    bgcolor:
                      selectedImage.type === 'satellite'
                        ? 'primary.main'
                        : selectedImage.type === 'drone'
                          ? 'secondary.main'
                          : 'success.main',
                    color: 'white',
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Tabs
                  value={selectedTab}
                  onChange={handleDialogTabChange}
                  aria-label="image view tabs"
                >
                  <Tab label="Image" />
                  <Tab label="Analysis" />
                </Tabs>
              </Box>

              {selectedTab === 0 ? (
                <Box
                  sx={{
                    width: '100%',
                    height: 400,
                    backgroundImage: `url(${selectedImage.url})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    bgcolor: 'black',
                  }}
                />
              ) : (
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Image Analysis
                  </Typography>
                  <Typography variant="body2" paragraph>
                    This is a simulated analysis of the field image. In a real
                    application, this would show AI-powered analysis of crop
                    health, pest detection, disease identification, and growth
                    stage assessment based on the image.
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Vegetation Health
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ mr: 1, width: 100 }}>
                            NDVI Index:
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={75}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 5 }}
                            color="success"
                          />
                          <Typography variant="body2" sx={{ ml: 1, width: 40 }}>
                            0.75
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ mr: 1, width: 100 }}>
                            Leaf Area:
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={80}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 5 }}
                            color="success"
                          />
                          <Typography variant="body2" sx={{ ml: 1, width: 40 }}>
                            80%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1, width: 100 }}>
                            Chlorophyll:
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={65}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 5 }}
                            color="success"
                          />
                          <Typography variant="body2" sx={{ ml: 1, width: 40 }}>
                            65%
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Stress Factors
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ mr: 1, width: 100 }}>
                            Water Stress:
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={15}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 5 }}
                            color="success"
                          />
                          <Typography variant="body2" sx={{ ml: 1, width: 40 }}>
                            15%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ mr: 1, width: 100 }}>
                            Pest Damage:
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={10}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 5 }}
                            color="success"
                          />
                          <Typography variant="body2" sx={{ ml: 1, width: 40 }}>
                            10%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1, width: 100 }}>
                            Disease:
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={5}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 5 }}
                            color="success"
                          />
                          <Typography variant="body2" sx={{ ml: 1, width: 40 }}>
                            5%
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Captured on {new Date(selectedImage.date).toLocaleDateString()}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default FieldStatus