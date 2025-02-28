import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SuperAdminRouteProps {
  children: ReactNode;
}

const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // For direct debugging - check what's in localStorage
  React.useEffect(() => {
    console.log('SuperAdminRoute mounted at path:', location.pathname);
    
    // Check localStorage for auth token
    const storageKey = `sb-${import.meta.env.VITE_SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token`;
    const authData = localStorage.getItem(storageKey);
    console.log('Auth data in localStorage:', authData ? 'exists (length: ' + authData.length + ')' : 'none');
  }, [location.pathname]);

  // Force authentication state reset if taking too long
  React.useEffect(() => {
    // Dispatch safety event after 4 seconds if still loading
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.warn('SuperAdminRoute: Loading stuck for 4 seconds, forcing reset');
        window.dispatchEvent(new Event('auth:forceReset'));
      }
    }, 4000);
    
    return () => clearTimeout(safetyTimer);
  }, [loading]);

  // Enhanced loading state with a delay to prevent flash redirects
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
        <p className="text-lg text-gray-700">Loading your dashboard...</p>
      </div>
    );
  }

  // Before redirecting, try to restore session directly to avoid unnecessary navigation
  React.useEffect(() => {
    if (user === null && !loading) {
      // Get SessionManager and try one last session restore before redirecting
      const trySessionRestore = async () => {
        try {
          const { SessionManager } = await import('../lib/supabase');
          const restored = await SessionManager.restore();
          console.log('Last-chance session restore result:', restored);
        } catch (err) {
          console.error('Error in last-chance session restore:', err);
        }
      };
      
      trySessionRestore();
    }
  }, [user, loading]);

  // Only redirect if explicitly not logged in after loading completes and restore attempts
  if (user === null && !loading) {
    console.log('No user found in SuperAdminRoute, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user && user.role !== 'superadmin') {
    console.log('User does not have superadmin privileges, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default SuperAdminRoute;
