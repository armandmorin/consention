import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Add additional check to verify user data on route changes
  useEffect(() => {
    // Check if we have user in localStorage but not in state
    const storedUser = localStorage.getItem('user');
    if (!user && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Only reload if the stored user has admin rights
        if (parsedUser.role === 'admin' || parsedUser.role === 'superadmin') {
          console.log('Found admin user in localStorage but not in state, refreshing page');
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
