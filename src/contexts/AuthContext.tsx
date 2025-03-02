import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useClerk,
  useUser,
  useSession,
  SignInResource
} from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';

// Define user roles
export type UserRole = 'superadmin' | 'admin' | 'client';

// Define user interface
interface User {
  id: string;       // Clerk user ID
  dbId?: string;    // Optional Supabase ID for database operations
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
  imageUrl?: string;
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
  signup: (email: string, name: string, role: UserRole, organization?: string) => Promise<any>;
  forgotPassword: () => void;
  resetPassword: () => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const clerk = useClerk();
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const { session, isLoaded: isSessionLoaded } = useSession();

  // Sync Clerk user with our app user and Supabase profiles
  useEffect(() => {
    const syncUserWithProfile = async () => {
      if (!isUserLoaded || !isSessionLoaded) return;
      
      // If we have a Clerk user, get or create the profile
      if (clerkUser) {
        setLoading(true);
        
        try {
          // Get primary email address
          const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress;
          
          if (!primaryEmail) {
            console.error('User has no primary email address');
            setError('Missing email address information');
            setLoading(false);
            return;
          }
          
          // Try to find the user in our database
          const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', primaryEmail)
            .single();
            
          if (fetchError && fetchError.code !== 'PGRST116') { // Not found is ok for new users
            console.error('Error fetching profile:', fetchError);
            setError('Failed to load user profile');
            setLoading(false);
            return;
          }
          
          let userProfile;
          
          // If profile exists, use it
          if (profile) {
            console.log('Found existing profile in Supabase for', primaryEmail);
            userProfile = {
              id: clerkUser.id, // We use Clerk's ID for our app
              dbId: profile.id, // Store the Supabase ID separately for database operations
              email: primaryEmail,
              name: profile.name || clerkUser.firstName || '',
              role: profile.role as UserRole || 'client',
              organization: profile.organization,
              imageUrl: clerkUser.imageUrl
            };
          } else {
            // For new users, we can't create a profile directly due to foreign key constraints
            console.log(`No existing profile for ${primaryEmail} in Supabase.`);
            console.log('Using Clerk-only profile. User will have limited functionality.');
            
            // Set default role for users without Supabase profiles
            const defaultRole = 'client';
            
            // We'll still create a user object for the app to use
            // but it won't be persisted in Supabase without additional backend work
            userProfile = {
              id: clerkUser.id,
              email: primaryEmail,
              name: clerkUser.firstName || primaryEmail.split('@')[0],
              role: defaultRole,
              imageUrl: clerkUser.imageUrl
            };
            
            // Log instructions for admin
            console.log('ADMIN ACTION REQUIRED: To give this user full functionality:');
            console.log('1. Create a user in Supabase Auth with this email:', primaryEmail);
            console.log('2. Ensure a corresponding profile record exists');
          }
          
          setUser(userProfile);
        } catch (err) {
          console.error('Error syncing user profile:', err);
          setError('Failed to sync user profile');
        } finally {
          setLoading(false);
        }
      } else {
        // No Clerk user means we're logged out
        setUser(null);
        setLoading(false);
      }
    };
    
    syncUserWithProfile();
  }, [clerkUser, isUserLoaded, isSessionLoaded]);

  // Simplified login function that uses Clerk
  const login = () => {
    clerk.openSignIn();
  };

  // Simplified logout function
  const logout = () => {
    clerk.signOut().then(() => {
      // Clear our internal user state
      setUser(null);
      // Navigate to login page - Clerk will automatically redirect based on config
    });
  };

  // Signup function can create admin users
  const signup = async (email: string, name: string, role: UserRole, organization?: string) => {
    setError(null);
    
    // Are we an admin creating another user?
    const isAdminCreatingUser = user?.role === 'admin' || user?.role === 'superadmin';
    
    try {
      // For admins creating users, we use a different flow
      if (isAdminCreatingUser) {
        // We would use Clerk's backend API via a server endpoint to create users
        // For now, just log the intent and create a profile in Supabase
        console.log('Admin creating user:', { email, name, role, organization });
        
        // We need a different approach here as well
        // For admin-created users, we'd typically need a backend endpoint
        // that handles both Clerk user creation and Supabase profile creation
        
        // For now, just log what we would do
        console.log("To create a new user, we need to:", {
          action1: "Create user in Clerk via Admin API",
          action2: "Create corresponding Supabase Auth user",
          action3: "Create profile record linked to that user",
          userData: { email, name, role, organization }
        });
          
        // Since we're not actually doing the profile creation here, 
        // we won't have profileError
        
        return { success: true };
      } else {
        // For self-signup, redirect to Clerk signup
        clerk.openSignUp();
        return { success: true };
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
      return { success: false, error: err };
    }
  };

  // Simplified forgot password function
  const forgotPassword = () => {
    clerk.openSignIn({
      initialPage: 'forgot-password'
    });
  };

  // Reset password just opens the Clerk flow
  const resetPassword = () => {
    clerk.openUserProfile({
      initialPage: 'security'
    });
  };

  const value = {
    user,
    loading: loading || !isUserLoaded || !isSessionLoaded,
    error,
    login,
    logout,
    signup,
    forgotPassword,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
