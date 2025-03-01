import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface SuperAdminRouteProps {
  children: ReactNode;
}

// Standard SuperAdminRoute implementation using proper role checks
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
  
  // Standard role check using context user
  if (user && user.role === 'superadmin') {
    console.log('SuperAdminRoute: Access granted via auth context');
    return <>{children}</>;
  }
  
  // If no user or wrong role, redirect
  console.log('SuperAdminRoute: Access denied - Not a superadmin');
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default SuperAdminRoute;
