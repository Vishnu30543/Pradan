import { useState, useEffect } from 'react'
import { Box, Typography, Paper, CircularProgress, Grid, Card, CardContent } from '@mui/material'
import axios from 'axios'

const CarbonCredits = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/executive/carbon-credits')
        setData(response.data)
        setError(null)
      } catch (err) {
        setError('Failed to load carbon credit data.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Carbon Credits
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body1">
          {data && data.message ? data.message : 'Carbon credit data loaded.'}
        </Typography>
      </Paper>
      {/* You can expand this section to show more detailed carbon credit analytics */}
      {data && data.credits && (
        <Grid container spacing={2}>
          {data.credits.map((credit, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{credit.title}</Typography>
                  <Typography variant="body2">{credit.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default CarbonCredits