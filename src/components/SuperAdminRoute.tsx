import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SuperAdminRouteProps {
  children: React.ReactNode;
}

// Basic SuperAdminRoute component - checks user role and redirects if needed
const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // While authentication is being checked, show loading spinner
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  // If no user or not a superadmin, redirect to login
  if (!user || user.role !== 'superadmin') {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // User is authenticated as superadmin, render children
  return <>{children}</>;
};

export default SuperAdminRoute;