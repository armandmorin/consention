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
  // Handle routing and localStorage synchronization
  React.useEffect(() => {
    console.log('App mounted, initializing...');
    
    // Make sure session is hydrated from localStorage by accessing it
    const checkSession = async () => {
      try {
        // Force Supabase to hydrate from storage
        const key = localStorage.getItem(`sb-${import.meta.env.VITE_SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token`);
        console.log('Auth token in localStorage:', key ? 'exists' : 'none');
        
        // Explicitly tell Supabase to check storage for session
        const { data } = await import('./lib/supabase').then(module => module.supabase.auth.getSession());
        console.log('Session check on app mount:', data.session ? 'active' : 'none');
      } catch (err) {
        console.error('Session check error:', err);
      }
    };
    
    checkSession();
    
    // Handle 404 redirects from sessionStorage (set by 404.html)
    try {
      const redirectData = sessionStorage.getItem('redirect');
      if (redirectData) {
        // Clear it immediately to prevent redirect loops
        sessionStorage.removeItem('redirect');
        
        // Parse the saved location data
        const { pathname } = JSON.parse(redirectData);
        console.log('Handling redirect from 404 page to:', pathname);
        
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
    
    // Set up unload handler to help with session persistence
    const handleBeforeUnload = () => {
      // Log that we're about to unload
      console.log('Page about to unload, preserving auth state');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
  
  return (
    <Router>
      {/* Use key to force remount when URL changes */}
      <AuthProvider key={window.location.pathname}>
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
