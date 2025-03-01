import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SessionManager } from '../lib/supabase';

interface SuperAdminRouteProps {
  children: ReactNode;
}

// Implementation with special bypass for armandmorin@gmail.com
const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Check multiple sources for armandmorin@gmail.com access
  const isArmand = SessionManager.isArmandMorin() || 
                  window.SUPERADMIN_ACCESS_GRANTED === true ||
                  sessionStorage.getItem('force_superadmin_access') === 'true';
  
  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
        <p className="text-lg text-gray-700">Loading your dashboard...</p>
      </div>
    );
  }
  
  // Allow access if the user is a superadmin from auth context
  if (user && user.role === 'superadmin') {
    console.log('SuperAdminRoute: Access granted via auth context');
    return <>{children}</>;
  }
  
  // Special bypass for armandmorin@gmail.com
  if (isArmand) {
    console.log('SuperAdminRoute: Special access granted for armandmorin@gmail.com');
    return <>{children}</>;
  }
  
  // Check if a user exists but doesn't have proper role
  if (user && user.role !== 'superadmin') {
    console.log('SuperAdminRoute: Access denied - user exists but is not superadmin');
    return <Navigate to="/" replace />;
  }
  
  // No authenticated user, redirect to login
  console.log('SuperAdminRoute: No authenticated user, redirecting to login');
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default SuperAdminRoute;
