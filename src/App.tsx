import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth pages
import Login from './pages/auth/Login';

// Context providers
import { AuthProvider } from './contexts/AuthContext';

// Protected route components
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import SuperAdminRoute from './components/SuperAdminRoute';

// Public pages
import LandingPage from './pages/public/LandingPage';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import BrandingSettings from './pages/admin/BrandingSettings';
import ClientManagement from './pages/admin/ClientManagement';
import CodeGenerator from './pages/admin/CodeGenerator';
import AdminAnalytics from './pages/admin/Analytics';

// SuperAdmin pages
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import AdminManagement from './pages/superadmin/AdminManagement';
import GlobalBranding from './pages/superadmin/GlobalBranding';
import GlobalAnalytics from './pages/superadmin/GlobalAnalytics';

// Client pages
import ClientDashboard from './pages/client/Dashboard';
import ClientAnalytics from './pages/client/Analytics';

// Removed middleware entirely to simplify rendering flow

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* SuperAdmin routes */}
          <Route path="/superadmin" element={
            <SuperAdminRoute>
              <SuperAdminDashboard />
            </SuperAdminRoute>
          } />
          <Route path="/superadmin/admins" element={
            <SuperAdminRoute>
              <AdminManagement />
            </SuperAdminRoute>
          } />
          <Route path="/superadmin/branding" element={
            <SuperAdminRoute>
              <GlobalBranding />
            </SuperAdminRoute>
          } />
          <Route path="/superadmin/analytics" element={
            <SuperAdminRoute>
              <GlobalAnalytics />
            </SuperAdminRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/clients" element={
            <AdminRoute>
              <ClientManagement />
            </AdminRoute>
          } />
          <Route path="/admin/branding" element={
            <AdminRoute>
              <BrandingSettings />
            </AdminRoute>
          } />
          <Route path="/admin/code" element={
            <AdminRoute>
              <CodeGenerator />
            </AdminRoute>
          } />
          <Route path="/admin/analytics" element={
            <AdminRoute>
              <AdminAnalytics />
            </AdminRoute>
          } />
          
          {/* Client routes */}
          <Route path="/client" element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/client/analytics" element={
            <ProtectedRoute>
              <ClientAnalytics />
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
