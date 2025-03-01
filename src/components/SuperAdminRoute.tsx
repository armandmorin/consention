import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SuperAdminRouteProps {
  children: ReactNode;
}

const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Log path and check localStorage (no cleanup needed)
  console.log('SuperAdminRoute mounted at path:', location.pathname);
  
  // Simplify - remove localStorage check that's not needed here
  
  // Simplified - no useEffect hooks that could cause React Error #310

  // Enhanced loading state with a delay to prevent flash redirects
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
        <p className="text-lg text-gray-700">Loading your dashboard...</p>
      </div>
    );
  }

  // Remove this useEffect entirely - session restoration is now handled at the App level
  // This useEffect was causing React Error #310 by creating a race condition
  // The SessionManager is now imported directly in App.tsx and initialized once

  // Simple redirect check - no useEffect to avoid React Error #310
  // Let's use the navigate for redirection instead of useEffect
  if (!loading) {
    if (user === null) {
      console.log('No user found in SuperAdminRoute, redirecting to login');
      // Navigate to login
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    
    if (user && user.role !== 'superadmin') {
      console.log('User does not have superadmin privileges, redirecting to home');
      // Navigate to home
      return <Navigate to="/" replace />;
    }
  }
  
  // We've already handled the redirect cases above, this code is redundant
  // and could be causing the React error

  return <>{children}</>;
};

export default SuperAdminRoute;
