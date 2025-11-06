import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import AuthContext from '../../context/AuthContext'

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [role, setRole] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials({ ...credentials, [name]: value })
  }

  const handleRoleChange = (e) => {
    setRole(e.target.value)
    // Reset credentials when role changes
    setCredentials({
      username: '',
      email: '',
      password: '',
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let loginData = {}

      // Prepare login data based on role
      if (role === 'admin') {
        loginData = {
          adminname: credentials.username,
          password: credentials.password,
        }
      } else if (role === 'executive') {
        loginData = {
          email: credentials.email,
          password: credentials.password,
        }
      } else if (role === 'farmer') {
        loginData = {
          mobileNo: credentials.username, // Using username field for mobile number
          password: credentials.password,
        }
      }

      const result = await login(loginData, role)

      if (!result.success) {
        setError(result.message)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              borderRadius: '50%',
              p: 1,
              mb: 2,
            }}
          >
            <LockOutlinedIcon />
          </Box>
          <Typography component="h1" variant="h5" gutterBottom>
            Agricultural Management System
          </Typography>
          <Typography component="h2" variant="h6" gutterBottom>
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role"
                value={role}
                label="Role"
                onChange={handleRoleChange}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="executive">Executive</MenuItem>
                <MenuItem value="farmer">Farmer</MenuItem>
              </Select>
            </FormControl>

            {role === 'admin' && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Admin Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={credentials.username}
                onChange={handleChange}
              />
            )}

            {role === 'executive' && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={credentials.email}
                onChange={handleChange}
              />
            )}

            {role === 'farmer' && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Mobile Number"
                name="username"
                autoComplete="tel"
                autoFocus
                value={credentials.username}
                onChange={handleChange}
              />
            )}

            {role && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!role || loading || (role === 'admin' && !credentials.username) || (role === 'executive' && !credentials.email) || (role === 'farmer' && !credentials.username) || !credentials.password}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>
        </Paper>
      </Box>
      <Box mt={8} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Agricultural Management System
        </Typography>
      </Box>
    </Container>
  )
}

export default Login