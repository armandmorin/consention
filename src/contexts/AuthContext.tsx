import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getUserRoleFromSession } from '../lib/supabase';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Define user roles
export type UserRole = 'superadmin' | 'admin' | 'client';

// Define user interface
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string, role: UserRole, organization?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Simple session handling that relies on Supabase's built-in mechanisms
  useEffect(() => {
    // Process authenticated user data after validating with server
    const processAuthenticatedUser = async (supabaseUser: SupabaseUser) => {
      try {
        console.log('Processing authenticated user:', supabaseUser.id);
        
        // Get profile data for complete user info
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();
        
        // Get role from JWT claims
        const roleFromJWT = supabaseUser.app_metadata?.role;

        if (profile) {
          // Determine user role - prioritize JWT if available
          let userRole: UserRole = 'client';
          
          if (roleFromJWT === 'superadmin' || profile.role === 'superadmin') {
            userRole = 'superadmin';
          } else if (roleFromJWT === 'admin' || profile.role === 'admin') {
            userRole = 'admin';
          }
          
          // Set the user state
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: profile.name || '',
            role: userRole,
            organization: profile.organization
          });
        } else {
          // Create minimal user if no profile found
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.email?.split('@')[0] || 'User',
            role: roleFromJWT as UserRole || 'client',
            organization: null
          });
        }
      } catch (err) {
        console.error('Error processing user data:', err);
      } finally {
        // Always finish by turning off loading
        setLoading(false);
      }
    };
    
    // Initial session check
    const getInitialSession = async () => {
      try {
        // Start with loading state
        setLoading(true);
        
        // Get the current session
        const { data } = await supabase.auth.getSession();
        
        // If we have a session, process it
        if (data.session) {
          await processAuthenticatedUser(data.session.user);
        } else {
          // No active session
          setUser(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error getting initial session:', err);
        setLoading(false);
      }
    };
    
    // Run the initial session check
    getInitialSession();
    
    // Set up auth state change listener for ongoing changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event);
        
        // Set loading true for any auth state change
        setLoading(true);
        
        if (session) {
          // We have a session, so process the user
          await processAuthenticatedUser(session.user);
        } else {
          // No session, so user is logged out
          setUser(null);
          setLoading(false);
        }
      }
    );
    
    // Cleanup function
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array ensures it only runs on mount

  // Simple login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      
      if (!data.session) {
        setError('No session returned');
        setLoading(false);
        return;
      }
      
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      // Determine user role
      let userRole: UserRole = 'client';
      const roleFromJWT = data.user.app_metadata?.role;
      
      if (profile) {
        // Use profile data
        if (roleFromJWT === 'superadmin' || profile.role === 'superadmin') {
          userRole = 'superadmin';
        } else if (roleFromJWT === 'admin' || profile.role === 'admin') {
          userRole = 'admin';
        }
        
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: profile.name || '',
          role: userRole,
          organization: profile.organization
        });
      } else {
        // No profile found
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: email.split('@')[0],
          role: roleFromJWT as UserRole || 'client',
          organization: null
        });
      }
      
      setLoading(false);
      
      // Navigation will happen automatically via the useEffect in the Login component
    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      setLoading(false);
    }
  };

  // Simplified logout function
  const logout = async () => {
    try {
      // Sign out from Supabase - this will clear the auth token
      await supabase.auth.signOut();
      // Clear local state after signout
      setUser(null);
      // Navigate to login page
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Still navigate to login if there was an error
      navigate('/login');
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string, role: UserRole, organization?: string) => {
    setLoading(true);
    setError(null);
    
    const isAdminCreatingUser = window.location.pathname.includes('/admin') || 
                              window.location.pathname.includes('/superadmin');
    
    try {
      let currentUser = null;
      if (isAdminCreatingUser) {
        currentUser = user;
      }
      
      // Create user in Supabase
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            organization
          }
        }
      });
      
      if (userError) {
        throw userError;
      }
      
      if (userData.user) {
        // Create profile record in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userData.user.id,
              name,
              role,
              organization,
              email
            }
          ]);
          
        if (profileError && profileError.code !== '23505') { // Ignore unique_violation
          throw profileError;
        }
        
        // If admin is creating a user, restore the admin's session
        if (isAdminCreatingUser && currentUser) {
          setUser(currentUser);
          setLoading(false);
          return { success: true, userId: userData.user.id };
        }
        
        // Otherwise, this is self-signup
        if (!isAdminCreatingUser) {
          const newUser: User = {
            id: userData.user.id,
            email,
            name,
            role,
            organization
          };
          
          setUser(newUser);
          setLoading(false);
          
          // Redirect based on role for self-signup
          if (role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/client');
          }
        }
        
        setLoading(false);
        return { success: true, userId: userData.user.id };
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
      setLoading(false);
      return { success: false, error: err };
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Send password reset email using Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        throw error;
      }
      
      navigate('/login', { state: { message: 'Password reset email sent' } });
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred sending password reset');
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (token: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Update user password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      navigate('/login', { state: { message: 'Password reset successful' } });
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during password reset');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
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
