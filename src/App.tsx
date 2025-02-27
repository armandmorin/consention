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

// For persistence debugging
const sessionCheckMiddleware = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    // Add debug information in console
    console.log('Rendering protected route component', {
      user: localStorage.getItem('user'),
      path: window.location.pathname
    });
    
    return <Component {...props} />;
  };
};

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
              {sessionCheckMiddleware(SuperAdminDashboard)()}
            </SuperAdminRoute>
          } />
          <Route path="/superadmin/admins" element={
            <SuperAdminRoute>
              {sessionCheckMiddleware(AdminManagement)()}
            </SuperAdminRoute>
          } />
          <Route path="/superadmin/branding" element={
            <SuperAdminRoute>
              {sessionCheckMiddleware(GlobalBranding)()}
            </SuperAdminRoute>
          } />
          <Route path="/superadmin/analytics" element={
            <SuperAdminRoute>
              {sessionCheckMiddleware(GlobalAnalytics)()}
            </SuperAdminRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin" element={
            <AdminRoute>
              {sessionCheckMiddleware(AdminDashboard)()}
            </AdminRoute>
          } />
          <Route path="/admin/clients" element={
            <AdminRoute>
              {sessionCheckMiddleware(ClientManagement)()}
            </AdminRoute>
          } />
          <Route path="/admin/branding" element={
            <AdminRoute>
              {sessionCheckMiddleware(BrandingSettings)()}
            </AdminRoute>
          } />
          <Route path="/admin/code" element={
            <AdminRoute>
              {sessionCheckMiddleware(CodeGenerator)()}
            </AdminRoute>
          } />
          <Route path="/admin/analytics" element={
            <AdminRoute>
              {sessionCheckMiddleware(AdminAnalytics)()}
            </AdminRoute>
          } />
          
          {/* Client routes */}
          <Route path="/client" element={
            <ProtectedRoute>
              {sessionCheckMiddleware(ClientDashboard)()}
            </ProtectedRoute>
          } />
          <Route path="/client/analytics" element={
            <ProtectedRoute>
              {sessionCheckMiddleware(ClientAnalytics)()}
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
