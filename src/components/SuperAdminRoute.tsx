import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, getUserRoleFromSession } from '../lib/supabase';

interface SuperAdminRouteProps {
  children: ReactNode;
}

// Improved SuperAdminRoute with direct session checking
const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [directAccess, setDirectAccess] = useState<boolean>(false);
  const [checkingDirect, setCheckingDirect] = useState<boolean>(true);
  const [loadTimer, setLoadTimer] = useState<NodeJS.Timeout | null>(null);

  // Directly check JWT claims and email
  useEffect(() => {
    const checkDirectAccess = async () => {
      try {
        // First check the JWT claims directly
        const roleFromJWT = await getUserRoleFromSession();
        if (roleFromJWT === 'superadmin') {
          console.log('SuperAdminRoute: Access granted via JWT claims');
          setDirectAccess(true);
          setCheckingDirect(false);
          return;
        }
        
        // Fall back to session email check
        const { data, error } = await supabase.auth.getSession();
        if (!error && data.session && data.session.user.email === 'armandmorin@gmail.com') {
          console.log('SuperAdminRoute: Direct access granted for armandmorin@gmail.com');
          setDirectAccess(true);
        }
        
        setCheckingDirect(false);
      } catch (err) {
        console.error('Error checking direct access in SuperAdminRoute:', err);
        setCheckingDirect(false);
      }
    };

    checkDirectAccess();
    
    // Set a timer to force render if loading gets stuck
    const timer = setTimeout(() => {
      if (loading && checkingDirect) {
        console.log('SuperAdminRoute: Loading state timeout, forcing completion');
        setCheckingDirect(false);
      }
    }, 2000); // 2 second timeout
    
    setLoadTimer(timer);
    
    return () => {
      if (loadTimer) clearTimeout(loadTimer);
    };
  }, [loading]);

  // If we have direct access, render immediately
  if (directAccess) {
    return <>{children}</>;
  }
  
  // Show loading spinner only briefly, with a timeout
  if (loading && checkingDirect) {
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
