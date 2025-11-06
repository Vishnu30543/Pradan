import { createContext, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [role, setRole] = useState(localStorage.getItem('role') || null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Set axios default header with token
  useEffect(() => {
    console.log('Setting axios default header with token:', token)
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      if (token && role) {
        try {
          // Get user profile based on role
          let response
          if (role === 'admin') {
            // For admin, we don't have a specific profile endpoint in this demo
            // Just verify the token is valid
            setUser({ role: 'admin' })
          } else if (role === 'executive') {
            // For executive, we would fetch their profile
            // This is a placeholder for the actual API call
            response = await axios.get('/api/executive/dashboard')
            setUser({ ...response.data.executive, role: 'executive' })
          } else if (role === 'farmer') {
            // For farmer, fetch their profile
            response = await axios.get('/api/farmer/profile')
            setUser({ ...response.data.farmer, role: 'farmer' })
          }
        } catch (error) {
          console.error('Authentication error:', error)
          // If token is invalid, logout
          logout()
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [token, role])

  // Login function
  const login = async (credentials, userRole) => {
    try {
      let response

      // Call appropriate login endpoint based on role
      if (userRole === 'admin') {
        response = await axios.post('/api/admin/login', credentials)
        // /api/admin/login
      } else if (userRole === 'executive') {
        response = await axios.post('/api/executive/login', credentials)
      } else if (userRole === 'farmer') {
        // For farmer, we would need a login endpoint
        // This is a placeholder for the actual API call
        response = await axios.post('/api/farmer/login', credentials)
      }

      // Save token and role to localStorage and state
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('role', userRole)
      setToken(response.data.token)
      setRole(userRole)

      // Set user data
      if (userRole === 'admin') {
        setUser({ ...response.data.admin, role: 'admin' })
      } else if (userRole === 'executive') {
        setUser({ ...response.data.executive, role: 'executive' })
      } else if (userRole === 'farmer') {
        setUser({ ...response.data.farmer, role: 'farmer' })
      }

      // Redirect based on role
      if (userRole === 'admin') {
        navigate('/admin')
      } else if (userRole === 'executive') {
        navigate('/executive')
      } else if (userRole === 'farmer') {
        navigate('/farmer')
      }

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      }
    }
  }

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('role')

    // Clear state
    setToken(null)
    setRole(null)
    setUser(null)

    // Redirect to login
    navigate('/login')
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!role
  }

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!role) return false
    return roles.includes(role)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        login,
        logout,
        isAuthenticated,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext