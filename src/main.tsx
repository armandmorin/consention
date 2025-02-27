import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

// Auth pages
import Login from './pages/auth/Login'

// Context providers
import { AuthProvider } from './contexts/AuthContext'

// Protected route components
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import SuperAdminRoute from './components/SuperAdminRoute'

// Public pages
import LandingPage from './pages/public/LandingPage'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'

// SuperAdmin pages
import SuperAdminDashboard from './pages/superadmin/Dashboard'

// Client pages
import ClientDashboard from './pages/client/Dashboard'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* SuperAdmin routes */}
          <Route 
            path="/superadmin" 
            element={
              <SuperAdminRoute>
                <SuperAdminDashboard />
              </SuperAdminRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          
          {/* Client routes */}
          <Route 
            path="/client" 
            element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  </React.StrictMode>
)
