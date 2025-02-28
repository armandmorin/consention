import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SuperAdminRouteProps {
  children: ReactNode;
}

const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

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

  // Only redirect if explicitly not logged in after loading completes
  if (user === null) {
    console.log('No user found in SuperAdminRoute, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'superadmin') {
    console.log('User does not have superadmin privileges, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default SuperAdminRoute;
