import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

// Enhanced AdminRoute component with Clerk
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // While authentication is being checked, show loading spinner
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <>
      {/* Use Clerk's components for auth state */}
      <SignedIn>
        {/* If signed in but not an admin or superadmin, redirect to client dashboard */}
        {user && user.role !== 'admin' && user.role !== 'superadmin' ? (
          <Navigate 
            to="/client" 
            state={{ from: location.pathname }} 
            replace 
          />
        ) : (
          // User is authenticated as admin or superadmin, render children
          <>{children}</>
        )}
      </SignedIn>
      
      {/* If not signed in, redirect to sign in */}
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default AdminRoute;