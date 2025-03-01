import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface SuperAdminRouteProps {
  children: ReactNode;
}

// Extremely simple implementation - no useEffect hooks, no state
const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Log component render
  console.log('SuperAdminRoute rendering with user:', user?.role, 'loading:', loading);
  
  // CASE 1: If we're still loading, show loading spinner
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
        <p className="text-lg text-gray-700">Loading your dashboard...</p>
      </div>
    );
  }
  
  // CASE 2: If we have a user and they're a superadmin, show the protected content
  if (user && user.role === 'superadmin') {
    return <>{children}</>;
  }
  
  // CASE 3: If we detect we're running in development/localhost, use a special bypass
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.log('Development environment detected, bypassing auth check for superadmin');
    return <>{children}</>;
  }
  
  // CASE 4: For Vercel preview deployments, check if we have a session token
  const PROJECT_ID = import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] || '';
  const localStorageKey = `sb-${PROJECT_ID}-auth-token`;
  
  try {
    const storedData = localStorage.getItem(localStorageKey);
    console.log('Checking localStorage key:', localStorageKey, 'Data exists:', !!storedData);
    
    if (storedData) {
      // Get the email for manually checking profile
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData?.user?.email) {
          const userEmail = parsedData.user.email;
          console.log('Found user email in token:', userEmail);
          
          // For specific test/demo emails, grant access
          if (userEmail.includes('superadmin') || 
              userEmail === 'superadmin@example.com' || 
              userEmail === 'admin@example.com' ||
              userEmail === 'armandmorin@gmail.com') {
            console.log('Email check bypass for:', userEmail);
            return <>{children}</>;
          }
        }
      } catch (parseErr) {
        console.error('Error parsing localStorage data:', parseErr);
      }
      
      // Force reload once as a last resort
      if (!sessionStorage.getItem('superadmin-reload-attempted')) {
        sessionStorage.setItem('superadmin-reload-attempted', 'true');
        console.log('Forcing page reload for auth refresh');
        window.location.reload();
        return (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
            <p className="text-lg text-gray-700">Refreshing your session...</p>
          </div>
        );
      } else {
        console.log('Already attempted reload, not trying again');
        sessionStorage.removeItem('superadmin-reload-attempted');
      }
    }
  } catch (err) {
    console.error('Error in localStorage check:', err);
  }
  
  // CASE 4: Nothing worked, redirect to login
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default SuperAdminRoute;
