import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
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
  Chip,
  useTheme,
  alpha,
} from '@mui/material'
import {
  LockOutlined as LockOutlinedIcon,
  Agriculture as AgricultureIcon,
  PersonOutline as PersonOutlineIcon,
  MailOutline as MailOutlineIcon,
  PhoneAndroid as PhoneAndroidIcon,
} from '@mui/icons-material'
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
  const theme = useTheme()

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials({ ...credentials, [name]: value })
  }

  const handleRoleChange = (e) => {
    setRole(e.target.value)
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
          mobileNo: credentials.username,
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.secondary.main} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.18)}`,
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
            },
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                mb: 2,
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <AgricultureIcon sx={{ fontSize: 36, color: 'white' }} />
            </Box>
            <Typography
              component="h1"
              variant="h5"
              fontWeight="600"
              gutterBottom
              sx={{
                color: theme.palette.primary.main,
                mb: 0.5,
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              fontWeight="500"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Agricultural Management System
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                animation: 'slideDown 0.3s ease-out',
                '@keyframes slideDown': {
                  from: { opacity: 0, transform: 'translateY(-10px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <FormControl
              fullWidth
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                },
              }}
            >
              <InputLabel id="role-select-label">Select Your Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role"
                value={role}
                label="Select Your Role"
                onChange={handleRoleChange}
              >
                <MenuItem value="admin">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonOutlineIcon fontSize="small" />
                    Admin
                  </Box>
                </MenuItem>
                <MenuItem value="executive">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonOutlineIcon fontSize="small" />
                    Executive
                  </Box>
                </MenuItem>
                <MenuItem value="farmer">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AgricultureIcon fontSize="small" />
                    Farmer
                  </Box>
                </MenuItem>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
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
                InputProps={{
                  startAdornment: <MailOutlineIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
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
                InputProps={{
                  startAdornment: <PhoneAndroidIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
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
                InputProps={{
                  startAdornment: <LockOutlinedIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!role || loading || (role === 'admin' && !credentials.username) || (role === 'executive' && !credentials.email) || (role === 'farmer' && !credentials.username) || !credentials.password}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.5)}`,
                },
                '&:disabled': {
                  background: theme.palette.action.disabledBackground,
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>

            {/* Demo Credentials */}
            <Box
              sx={{
                mt: 3,
                pt: 3,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                align="center"
                display="block"
                sx={{ mb: 1.5, fontWeight: 500 }}
              >
                Quick Demo Access
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Chip
                  label="Admin"
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setRole('admin')
                    setCredentials({ username: 'admin1', email: '', password: 'admin@543' })
                  }}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateY(-2px)',
                    },
                  }}
                />
                <Chip
                  label="Executive"
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setRole('executive')
                    setCredentials({ username: '', email: 'executive1@gmail.com', password: 'exe@123' })
                  }}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateY(-2px)',
                    },
                  }}
                />
                <Chip
                  label="Farmer"
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setRole('farmer')
                    setCredentials({ username: '9898989898', email: '', password: 'frm@123' })
                  }}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateY(-2px)',
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Footer */}
          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            display="block"
            sx={{ mt: 4 }}
          >
            © {new Date().getFullYear()} Agricultural Management System. All rights reserved.
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login