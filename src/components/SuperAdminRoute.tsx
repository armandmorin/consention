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

  // Enhanced loading check for SuperAdminRoute
  // Only show loader if we're definitely loading and not just initializing
  if (loading) {
    console.log('SuperAdminRoute - Loading state active');
    
    // Special case for direct access by URL
    // Check localStorage for session with Armand's email
    const checkLocalStorage = () => {
      try {
        const storageKey = `sb-fgnvobekfychilwomxij-auth-token`;
        const storedData = localStorage.getItem(storageKey);
        
        if (storedData) {
          const data = JSON.parse(storedData);
          if (data?.user?.email === 'armandmorin@gmail.com') {
            console.log('SuperAdminRoute: Found Armand in localStorage during loading');
            return true;
          }
        }
        return false;
      } catch (e) {
        return false;
      }
    };
    
    // If we detect Armand in localStorage, allow access even during loading
    if (checkLocalStorage()) {
      console.log('SuperAdminRoute: Allowing access to Armand during loading');
      return <>{children}</>;
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Special case for Armand's email
  if (user?.email === 'armandmorin@gmail.com') {
    return <>{children}</>;
  }
  
  // Check if user exists and has superadmin role
  if (user && user.role === 'superadmin') {
    return <>{children}</>;
  }
  
  // Redirect to login if not authenticated or not authorized
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default SuperAdminRoute;