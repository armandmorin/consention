import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, getUserRoleFromSession } from '../lib/supabase';

interface SuperAdminRouteProps {
  children: ReactNode;
}

// Completely rewritten SuperAdminRoute with failsafe mechanisms
const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [access, setAccess] = useState<boolean | null>(null);
  const [isArmand, setIsArmand] = useState<boolean>(false);
  
  // Check session independently from the Auth context
  useEffect(() => {
    const checkAccess = async () => {
      try {
        // First get the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('SuperAdminRoute: Error getting session:', sessionError);
          setAccess(false);
          return;
        }
        
        if (!sessionData.session) {
          console.log('SuperAdminRoute: No active session');
          setAccess(false);
          return;
        }
        
        // Check if we have Armand's email
        if (sessionData.session.user.email === 'armandmorin@gmail.com') {
          console.log('SuperAdminRoute: Found armandmorin@gmail.com email');
          setIsArmand(true);
          
          // Also check for superadmin in JWT
          const roleInJWT = sessionData.session.user.app_metadata?.role;
          if (roleInJWT === 'superadmin') {
            console.log('SuperAdminRoute: JWT contains superadmin role');
            setAccess(true);
            return;
          }
        }
        
        // Do a direct DB check for role as final verification
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', sessionData.session.user.id)
          .single();
          
        if (profileError) {
          console.error('SuperAdminRoute: Error fetching profile:', profileError);
          // If we're Armand, grant access anyway
          setAccess(isArmand);
          return;
        }
        
        if (profileData && profileData.role === 'superadmin') {
          console.log('SuperAdminRoute: DB profile confirms superadmin role');
          setAccess(true);
          return;
        }
        
        // Default case - only allow access if it's Armand
        setAccess(isArmand);
      } catch (err) {
        console.error('SuperAdminRoute: Unexpected error checking access:', err);
        // If we're having errors, let Armand in as a fallback
        setAccess(isArmand);
      }
    };
    
    // Run the check
    checkAccess();
  }, []);
  
  // Show loading spinner while we're determining access
  if (access === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
        <p className="text-lg text-gray-700">Loading your dashboard...</p>
      </div>
    );
  }
  
  // We've done our independent check and determined access
  if (access === true) {
    return <>{children}</>;
  }
  
  // Final fallback to context - if it's working correctly, use it
  if (user && user.role === 'superadmin') {
    console.log('SuperAdminRoute: Access granted via auth context');
    return <>{children}</>;
  }
  
  // No access granted by any method
  console.log('SuperAdminRoute: Access denied after all checks');
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default SuperAdminRoute;
