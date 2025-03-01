import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Removed potentially problematic reload effect

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found in AdminRoute, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin' && user.role !== 'superadmin') {
    console.log('User does not have admin privileges, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
