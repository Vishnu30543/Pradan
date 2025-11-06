import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import AuthContext from '../../context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, hasRole, loading } = useContext(AuthContext)

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  // Check if user has required role
  if (!hasRole(allowedRoles)) {
    // Redirect based on user's role
    const role = localStorage.getItem('role')
    if (role === 'admin') {
      return <Navigate to="/admin" replace />
    } else if (role === 'executive') {
      return <Navigate to="/executive" replace />
    } else if (role === 'farmer') {
      return <Navigate to="/farmer" replace />
    } else {
      // If role is invalid, redirect to login
      return <Navigate to="/login" replace />
    }
  }

  // If authenticated and has required role, render children
  return children
}

export default ProtectedRoute