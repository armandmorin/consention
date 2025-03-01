import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SuperAdminRouteProps {
  children: React.ReactNode;
}

// Simple SuperAdminRoute component
const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If still loading auth state, show brief loading indicator
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Check if user exists and has superadmin role
  if (user && user.role === 'superadmin') {
    return <>{children}</>;
  }
  
  // Redirect to login if not authenticated or not authorized
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default SuperAdminRoute;