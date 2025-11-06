import { Box, Typography, Paper } from '@mui/material'

const Notifications = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Notifications
    </Typography>
    <Paper sx={{ p: 2 }}>
      <Typography>
        Your notifications will be listed here.
      </Typography>
    </Paper>
  </Box>
)

export default Notifications