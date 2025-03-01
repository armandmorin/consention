import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SuperAdminRouteProps {
  children: React.ReactNode;
}

// Simplified SuperAdminRoute component
const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // While loading, render a simple loading indicator
  // This prevents flashing of login screen during auth checks
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  // After loading completes, we can be confident in the auth state
  // If user is null, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // If user exists but doesn't have superadmin role, redirect to login
  if (user.role !== 'superadmin') {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // User is authenticated as superadmin, render children
  return <>{children}</>;
};

export default SuperAdminRoute;