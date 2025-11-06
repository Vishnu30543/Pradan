import { useState } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material'
import {
  Description as DescriptionIcon,
  Download as DownloadIcon,
  PictureAsPdf as PictureAsPdfIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material'
import axios from 'axios'

const AdminReports = () => {
  const [reportType, setReportType] = useState('farmer')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value)
    setError(null)
    setSuccess(false)
  }

  const handleGenerateReport = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const response = await axios.post(
        '/api/admin/report',
        { reportType },
        { responseType: 'blob' }
      )

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf`
      )
      document.body.appendChild(link)
      link.click()
      link.remove()

      setSuccess(true)
    } catch (err) {
      console.error('Error generating report:', err)
      setError('Failed to generate report. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const reportTypeInfo = {
    farmer: {
      title: 'Farmer Report',
      description:
        'Generate a comprehensive report of all farmers in the system, including their personal details, village information, income data, and more.',
      icon: <PeopleIcon fontSize="large" sx={{ color: '#4caf50' }} />,
    },
    executive: {
      title: 'Executive Report',
      description:
        'Generate a detailed report of all executives in the system, including their contact information, assigned regions, and performance metrics.',
      icon: <PersonIcon fontSize="large" sx={{ color: '#2196f3' }} />,
    },
    analytics: {
      title: 'Analytics Report',
      description:
        'Generate a system-wide analytics report including farmer and executive statistics, income data, plant information, and carbon credit metrics.',
      icon: <AnalyticsIcon fontSize="large" sx={{ color: '#ff9800' }} />,
    },
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Report Generation
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate and download various reports for your agricultural management system.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Report generated successfully! The download should start automatically.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Select Report Type
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="report-type-label">Report Type</InputLabel>
              <Select
                labelId="report-type-label"
                id="report-type"
                value={reportType}
                label="Report Type"
                onChange={handleReportTypeChange}
              >
                <MenuItem value="farmer">Farmer Report</MenuItem>
                <MenuItem value="executive">Executive Report</MenuItem>
                <MenuItem value="analytics">Analytics Report</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<DownloadIcon />}
              onClick={handleGenerateReport}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Generate Report'
              )}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
              }}
            >
              {reportTypeInfo[reportType].icon}
              <Typography variant="h6" sx={{ ml: 2 }}>
                {reportTypeInfo[reportType].title}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" paragraph>
              {reportTypeInfo[reportType].description}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                What's included in this report:
              </Typography>
              <Grid container spacing={2}>
                {reportType === 'farmer' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="primary">
                            Farmer Statistics
                          </Typography>
                          <Typography variant="body2">
                            Total number of farmers in the system
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="primary">
                            Farmer Details
                          </Typography>
                          <Typography variant="body2">
                            Name, village, panchayat, income, and estimated income
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </>
                )}

                {reportType === 'executive' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="primary">
                            Executive Statistics
                          </Typography>
                          <Typography variant="body2">
                            Total number of executives in the system
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="primary">
                            Executive Details
                          </Typography>
                          <Typography variant="body2">
                            Name, email, region, and phone number
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </>
                )}

                {reportType === 'analytics' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="primary">
                            System Statistics
                          </Typography>
                          <Typography variant="body2">
                            Farmer count, executive count, plant count
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="primary">
                            Financial Data
                          </Typography>
                          <Typography variant="body2">
                            Total income, estimated income, income difference
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="primary">
                            Additional Metrics
                          </Typography>
                          <Typography variant="body2">
                            Carbon credits and partner companies
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
                p: 2,
                bgcolor: 'rgba(0, 0, 0, 0.03)',
                borderRadius: 1,
              }}
            >
              <PictureAsPdfIcon sx={{ mr: 1, color: '#f44336' }} />
              <Typography variant="body2" color="text.secondary">
                Reports are generated in PDF format and will download automatically
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminReports