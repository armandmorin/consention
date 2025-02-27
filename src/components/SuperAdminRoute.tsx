import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SuperAdminRouteProps {
  children: ReactNode;
}

const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Add additional check to verify user data on route changes
  useEffect(() => {
    // Check if we have user in localStorage but not in state
    const storedUser = localStorage.getItem('user');
    if (!user && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Only reload if the stored user has superadmin rights
        if (parsedUser.role === 'superadmin') {
          console.log('Found superadmin user in localStorage but not in state, refreshing page');
          window.location.reload();
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  }, [user, location.pathname]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
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
