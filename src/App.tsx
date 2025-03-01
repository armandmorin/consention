import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth pages
import Login from './pages/auth/Login';

// Context providers
import { AuthProvider } from './contexts/AuthContext';

// Protected route components
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import SuperAdminRoute from './components/SuperAdminRoute';

// Import supabase client directly
import { supabase } from './lib/supabase';

// Public pages
import LandingPage from './pages/public/LandingPage';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import BrandingSettings from './pages/admin/BrandingSettings';
import ClientManagement from './pages/admin/ClientManagement';
import CodeGenerator from './pages/admin/CodeGenerator';
import AdminAnalytics from './pages/admin/Analytics';
import ClientEdit from './pages/admin/ClientEdit';

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
  // Enhanced app initialization with session refresh
  useEffect(() => {
    // Immediately attempt to refresh the session when app loads
    const refreshSession = async () => {
      try {
        // Try to refresh the token
        const { data, error } = await supabase.auth.refreshSession();
        console.log('Session refresh on app load:', error ? 'failed' : 'success');
      } catch (e) {
        console.error('Error refreshing session on app load:', e);
      }
    };
    
    // Refresh session on app load
    refreshSession();
    
    // Handle 404 redirects from sessionStorage (set by 404.html)
    try {
      const redirectData = sessionStorage.getItem('redirect');
      if (redirectData) {
        // Clear it immediately to prevent redirect loops
        sessionStorage.removeItem('redirect');
        
        // Parse the saved location data
        const { pathname } = JSON.parse(redirectData);
        
        // Let the app initialize first, then navigate
        setTimeout(() => {
          window.history.replaceState(null, '', pathname);
          // Force the router to notice the change
          window.dispatchEvent(new Event('popstate'));
        }, 0);
      }
    } catch (e) {
      console.error('Error handling redirect:', e);
    }
    
    // Set up listener for session persistence issues
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key?.includes('supabase') && !event.newValue) {
        console.warn('Supabase session was cleared from storage!');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  return (
    <Router>
      {/* Remove the key prop that's causing unmounting issues */}
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
          <Route path="/admin/code/:clientId" element={
            <AdminRoute>
              <CodeGenerator />
            </AdminRoute>
          } />
          <Route path="/admin/client/:clientId" element={
            <AdminRoute>
              <ClientEdit />
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
