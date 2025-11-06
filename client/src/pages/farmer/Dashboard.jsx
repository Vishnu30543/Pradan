import { Box, Typography, Paper } from '@mui/material'

const FarmerDashboard = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Farmer Dashboard
    </Typography>
    <Paper sx={{ p: 2 }}>
      <Typography>
        Welcome to your dashboard. Key information and stats will appear here.
      </Typography>
    </Paper>
  </Box>
)

export default FarmerDashboard