import { Box, Typography, Paper } from '@mui/material'

const Requests = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Farmer Requests
    </Typography>
    <Paper sx={{ p: 2 }}>
      <Typography>
        Your requests and their status will be listed here.
      </Typography>
    </Paper>
  </Box>
)

export default Requests