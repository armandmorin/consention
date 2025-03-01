import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, getUserRoleFromSession } from '../lib/supabase';

interface SuperAdminRouteProps {
  children: ReactNode;
}

// Hybrid approach until database triggers are working
const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState<string | null>(null);
  const [emailChecked, setEmailChecked] = useState<boolean>(false);

  // Check for special case with armandmorin@gmail.com
  useEffect(() => {
    // Only run this once
    if (emailChecked) return;

    const checkArmandStatus = async () => {
      try {
        // Get current session from Supabase
        const { data, error } = await supabase.auth.getSession();
        if (!error && data.session) {
          setEmail(data.session.user.email);
        }
        setEmailChecked(true);
      } catch (err) {
        console.error('Error checking session in SuperAdminRoute:', err);
        setEmailChecked(true);
      }
    };

    checkArmandStatus();
  }, [emailChecked]);

  // Show loading spinner while auth state is being determined
  if (loading || !emailChecked) {
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

  // Special bypass for armandmorin@gmail.com while database triggers are set up
  if (email === 'armandmorin@gmail.com') {
    console.log('SuperAdminRoute: Special access granted for armandmorin@gmail.com');
    return <>{children}</>;
  }
  
  // If no user or wrong role, redirect
  console.log('SuperAdminRoute: Access denied - Not a superadmin');
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default SuperAdminRoute;
