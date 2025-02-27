import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SuperAdminRouteProps {
  children: ReactNode;
}

const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'superadmin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default SuperAdminRoute;
