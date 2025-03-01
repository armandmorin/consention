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

  // Initialize user from Supabase session with simplified approach
  useEffect(() => {
    // Process authenticated user data - simplified
    const processAuthenticatedUser = async (userId: string, email: string) => {
      // Get profile data for complete user info
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      // Get role from JWT if available
      const { data: session } = await supabase.auth.getSession();
      const roleFromJWT = session?.session?.user?.app_metadata?.role;

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
          id: userId,
          email: email || '',
          name: profile.name || '',
          role: userRole,
          organization: profile.organization
        });
      } else {
        // Create minimal user if no profile found
        setUser({
          id: userId,
          email: email || '',
          name: email?.split('@')[0] || 'User',
          role: roleFromJWT as UserRole || 'client',
          organization: null
        });
      }
      
      setLoading(false);
    };
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setLoading(true);
          await processAuthenticatedUser(
            session.user.id,
            session.user.email || ''
          );
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          if (session) {
            // Only refresh user data if we don't already have the user
            if (!user) {
              await processAuthenticatedUser(
                session.user.id,
                session.user.email || ''
              );
            }
          }
        } else if (event === 'INITIAL_SESSION') {
          if (session) {
            await processAuthenticatedUser(
              session.user.id,
              session.user.email || ''
            );
          } else {
            setLoading(false);
          }
        }
      }
    );
    
    // Check for active session immediately
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        setLoading(false);
        return;
      }
      
      // Only process if we haven't already
      if (!user) {
        await processAuthenticatedUser(
          data.session.user.id,
          data.session.user.email || ''
        );
      }
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Login attempt for:', email);
      
      // Authenticate with Supabase
      console.log('Authenticating with Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Supabase auth error:', error);
        setError(error.message);
        setLoading(false);
        throw error;
      }
      
      if (!data.session) {
        console.error('Authentication succeeded but no session was returned');
        throw new Error('Authentication problem: No session returned');
      }
      
      console.log('Authentication successful, session established');
      
      // Fetch the user's profile directly from the database
      console.log('Fetching user profile for ID:', data.user.id);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      console.log('Profile query result:', profile, profileError);
        
      // Handle profile data retrieval
      if (profileError) {
        console.error('Error fetching profile after login:', profileError);
        
        // For "not found" errors, create a new profile
        if (profileError.code === 'PGRST116') {
          console.log('Profile not found, creating one for new user');
          
          // Default role for new users is client
          const defaultRole: UserRole = 'client';
          
          // Create a new profile in the database
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email: data.user.email || '',
                name: data.user.user_metadata?.name || email.split('@')[0],
                role: defaultRole
              }
            ])
            .select()
            .single();
          
          if (insertError) {
            console.error('Failed to create user profile:', insertError);
            // Create minimal user
            const minimalUser = {
              id: data.user.id,
              email: data.user.email || '',
              name: email.split('@')[0],
              role: 'client' as UserRole
            };
            
            setUser(minimalUser);
            setLoading(false);
            navigate('/client');
            return;
          }
          
          // If profile creation succeeded, set up user with new profile
          const userWithNewProfile = {
            id: data.user.id,
            email: data.user.email || '',
            name: newProfile?.name || '',
            role: newProfile?.role as UserRole || 'client',
            organization: newProfile?.organization
          };
          
          setUser(userWithNewProfile);
          setLoading(false);
          navigate('/client');
          return;
        }
        
        // Last resort: Continue with minimal user info
        console.log('Using minimal user info as last resort');
        const minimalUser = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || email.split('@')[0],
          role: 'client' as UserRole
        };
        
        setUser(minimalUser);
        setLoading(false);
        navigate('/client');
        return;
      }
      
      // Profile exists, set up user with role
      console.log('User profile found:', profile);
      
      // Determine user role by checking JWT claims first, then profile
      let userRole: UserRole = 'client';
      
      // First check JWT claims
      const roleFromJWT = data.user.app_metadata?.role as UserRole;
      
      if (roleFromJWT === 'superadmin' || profile.role === 'superadmin') {
        console.log('User is a superadmin!');
        userRole = 'superadmin';
      } else if (roleFromJWT === 'admin' || profile.role === 'admin') {
        userRole = 'admin';
      }
      
      // Create complete user data
      const userData = {
        id: data.user.id,
        email: data.user.email || '',
        name: profile.name || '',
        role: userRole,
        organization: profile.organization
      };
      
      // Set user in context
      setUser(userData);
      
      console.log('Login successful, redirecting to dashboard');
      
      // Set loading to false before redirect
      setLoading(false);
      
      // Redirect based on role
      if (userRole === 'superadmin') {
        navigate('/superadmin');
      } else if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/client');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      setUser(null);
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
