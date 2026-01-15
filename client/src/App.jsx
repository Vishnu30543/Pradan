import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'

// Context
import { AuthProvider } from './context/AuthContext'

// Layouts
import AdminLayout from './layouts/AdminLayout'
import ExecutiveLayout from './layouts/ExecutiveLayout'
import FarmerLayout from './layouts/FarmerLayout'

// Pages - Auth
import Login from './pages/auth/Login'

// Pages - Admin
import AdminDashboard from './pages/admin/Dashboard'
import ExecutiveManagement from './pages/admin/ExecutiveManagement'
import FarmerOverview from './pages/admin/FarmerOverview'
import SchemeManagement from './pages/admin/SchemeManagement'
import AdminAnalytics from './pages/admin/Analytics'
import AdminReports from './pages/admin/Reports'

// Pages - Executive
import ExecutiveDashboard from './pages/executive/Dashboard'
import FarmerManagement from './pages/executive/FarmerManagement'
import RequestManagement from './pages/executive/RequestManagement'
import FieldManagement from './pages/executive/FieldManagement'

import IncomeAnalysis from './pages/executive/IncomeAnalysis'
import GovernmentSchemes from './pages/executive/GovernmentSchemes'
import SMSBroadcast from './pages/executive/SMSBroadcast'

// Pages - Farmer
import FarmerDashboard from './pages/farmer/Dashboard'
import FarmerProfile from './pages/farmer/Profile'
import FarmerRequests from './pages/farmer/Requests'
import FarmerFieldStatus from './pages/farmer/FieldStatus'
import FarmerIncome from './pages/farmer/Income'
import FarmerNotifications from './pages/farmer/Notifications'

// Components
import ProtectedRoute from './components/common/ProtectedRoute'
import NotFound from './pages/NotFound'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

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

  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="executives" element={<ExecutiveManagement />} />
          <Route path="farmers" element={<FarmerOverview />} />
          <Route path="schemes" element={<SchemeManagement />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* Executive Routes */}
        <Route
          path="/executive"
          element={
            <ProtectedRoute allowedRoles={['executive']}>
              <ExecutiveLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ExecutiveDashboard />} />
          <Route path="farmers" element={<FarmerManagement />} />
          <Route path="requests" element={<RequestManagement />} />
          <Route path="fields" element={<FieldManagement />} />

          <Route path="income-analysis" element={<IncomeAnalysis />} />
          <Route path="schemes" element={<GovernmentSchemes />} />
          <Route path="sms" element={<SMSBroadcast />} />
        </Route>

        {/* Farmer Routes */}
        <Route
          path="/farmer"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<FarmerDashboard />} />
          <Route path="profile" element={<FarmerProfile />} />
          <Route path="requests" element={<FarmerRequests />} />
          <Route path="field-status" element={<FarmerFieldStatus />} />
          <Route path="income" element={<FarmerIncome />} />
          <Route path="notifications" element={<FarmerNotifications />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App