import { Box, Typography, Paper } from '@mui/material'

const Income = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Income
    </Typography>
    <Paper sx={{ p: 2 }}>
      <Typography>
        Your income tracking and history will be displayed here.
      </Typography>
    </Paper>
  </Box>
)

export default Income