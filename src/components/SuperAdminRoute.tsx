import React, { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SessionManager } from '../lib/supabase';

interface SuperAdminRouteProps {
  children: ReactNode;
}

// Create a completely new implementation for SuperAdminRoute
const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [directSuperAdminCheck, setDirectSuperAdminCheck] = useState<boolean | null>(null);
  const [directCheckRunning, setDirectCheckRunning] = useState(false);

  // Log component render
  console.log('SuperAdminRoute rendering with user:', user?.role, 'loading:', loading);
  
  // Perform a direct check for superadmin permissions as a backup strategy
  useEffect(() => {
    let mounted = true;
    
    // Only run this check if auth context claims we have no user or wrong role
    if (!loading && (!user || user.role !== 'superadmin')) {
      console.log('Running direct superadmin check as a backup strategy');
      
      if (!directCheckRunning) {
        setDirectCheckRunning(true);
        
        // Use our new force check method that directly queries the database
        SessionManager.forceSuperAdminCheck().then(isSuperAdmin => {
          if (mounted) {
            console.log('Direct superadmin check result:', isSuperAdmin);
            setDirectSuperAdminCheck(isSuperAdmin);
            setDirectCheckRunning(false);
          }
        }).catch(err => {
          console.error('Error in direct superadmin check:', err);
          if (mounted) {
            setDirectSuperAdminCheck(false);
            setDirectCheckRunning(false);
          }
        });
      }
    }
    
    return () => {
      mounted = false;
    };
  }, [user, loading, directCheckRunning]);

  // CASE 1: Still loading from Auth context - show loading UI
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
        <p className="text-lg text-gray-700">Loading your dashboard...</p>
      </div>
    );
  }
  
  // CASE 2: Direct check is running - show secondary loading
  if (directCheckRunning) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-green-500 rounded-full border-t-transparent mb-4"></div>
        <p className="text-lg text-gray-700">Verifying admin permissions...</p>
      </div>
    );
  }
  
  // CASE 3: Auth context says user is superadmin - allow access
  if (user && user.role === 'superadmin') {
    console.log('Auth context confirmed superadmin role, granting access');
    return <>{children}</>;
  }
  
  // CASE 4: Direct check says user is superadmin - allow access
  if (directSuperAdminCheck === true) {
    console.log('Direct check confirmed superadmin role, granting access');
    return <>{children}</>;
  }
  
  // CASE 5: Both checks failed - redirect
  console.log('All checks failed, redirecting to login');
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default SuperAdminRoute;
