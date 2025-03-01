import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface AdminRouteProps {
  children: React.ReactNode;
}

// Direct AdminRoute component that doesn't rely on loading state
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [directAccess, setDirectAccess] = useState<boolean | null>(null);
  
  // Perform a direct session check without going through Auth context
  useEffect(() => {
    const checkSession = async () => {
      try {
        // If we already have a user with admin role from context, don't bother checking
        if (user?.role === 'admin' || user?.role === 'superadmin') {
          return;
        }
        
        // Get session directly from Supabase
        const { data } = await supabase.auth.getSession();
        
        if (data?.session) {
          // Check for admin access
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.session.user.id)
            .single();
            
          if (profile?.role === 'admin' || profile?.role === 'superadmin' || 
              data.session.user.app_metadata?.role === 'admin' || 
              data.session.user.app_metadata?.role === 'superadmin') {
            setDirectAccess(true);
            return;
          }
        }
        
        setDirectAccess(false);
      } catch (err) {
        setDirectAccess(false);
      }
    };
    
    checkSession();
  }, [user]);
  
  // If we have a user with admin/superadmin role from context, render children
  if (user?.role === 'admin' || user?.role === 'superadmin') {
    return <>{children}</>;
  }
  
  // If we've confirmed direct access, render children
  if (directAccess) {
    return <>{children}</>;
  }
  
  // If we've confirmed no access, redirect
  if (directAccess === false && user?.role !== 'admin' && user?.role !== 'superadmin') {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // While checking, render a blank component
  return null;
};

export default AdminRoute;