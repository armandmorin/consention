import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Add additional check to verify user data on route changes
  useEffect(() => {
    // Check if we have user in localStorage but not in state
    const storedUser = localStorage.getItem('user');
    if (!user && storedUser) {
      console.log('Found user in localStorage but not in state, refreshing page');
      window.location.reload();
    }
  }, [user, location.pathname]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    console.log('No user found in ProtectedRoute, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
