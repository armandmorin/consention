import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SuperAdminRouteProps {
  children: ReactNode;
}

// Simple, clean implementation now that the database properly syncs roles
const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
        <p className="text-lg text-gray-700">Loading your dashboard...</p>
      </div>
    );
  }
  
  // Allow access if the user is a superadmin
  if (user && user.role === 'superadmin') {
    return <>{children}</>;
  }
  
  // Otherwise redirect to login
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default SuperAdminRoute;
