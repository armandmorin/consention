import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Enhanced ProtectedRoute component with Clerk
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { loading } = useAuth();
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
        {/* User is authenticated, render children */}
        {children}
      </SignedIn>
      
      {/* If not signed in, redirect to sign in */}
      <SignedOut>
        <RedirectToSignIn redirectUrl={location.pathname} />
      </SignedOut>
    </>
  );
};

export default ProtectedRoute;