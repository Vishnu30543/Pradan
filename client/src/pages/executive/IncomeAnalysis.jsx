import { Box, Typography, Paper } from '@mui/material'

const IncomeAnalysis = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Income Analysis
    </Typography>
    <Paper sx={{ p: 2 }}>
      <Typography>
        Income analysis data and charts will be displayed here.
      </Typography>
    </Paper>
  </Box>
)

export default IncomeAnalysis