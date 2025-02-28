import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
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

  // Initialize user from Supabase session
  useEffect(() => {
    console.log('AuthContext initializing, checking session');
    
    // Function to get user profile data
    const getUserProfile = async (userId: string): Promise<any> => {
      try {
        // Get user profile data from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          throw profileError;
        }
        
        return profile;
      } catch (error) {
        console.error('Get user profile error:', error);
        return null;
      }
    };
    
    // Check current session
    const checkSession = async () => {
      try {
        setLoading(true);
        
        // Get current session directly - the timeout was causing issues
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Active session found, fetching user profile');
          const profile = await getUserProfile(session.user.id);
          
          // Combine auth and profile data
          if (profile) {
            // Explicit check for superadmin role
            let userRole: UserRole = 'client';
            if (profile.role === 'superadmin') {
              console.log('User is a superadmin!');
              userRole = 'superadmin';
            } else if (profile.role === 'admin') {
              userRole = 'admin';
            }
            
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: profile.name || '',
              role: userRole,
              organization: profile.organization
            });
          } else {
            // No profile but valid session, create minimal user
            console.warn('Session exists but no profile found, creating minimal user');
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || 'User',
              role: 'client'
            });
          }
        } else {
          // No session found, ensure loading is set to false
          console.log('No active session found, user not authenticated');
          setUser(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
        // Don't clear user on session check error, just log it
        // This prevents automatic logout on transient errors
      } finally {
        // Always set loading to false, even if there are errors
        console.log('Session check completed, setting loading to false');
        setLoading(false);
      }
    };
    
    // Add a safety timeout to ensure loading state is reset after 3 seconds max
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading state was stuck, forcing it to false');
        setLoading(false);
      }
    }, 3000);
    
    // Listen for force reset events from other components
    const handleForceReset = () => {
      console.log('Received force reset event, resetting auth loading state');
      setLoading(false);
    };
    
    window.addEventListener('auth:forceReset', handleForceReset);
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Get user profile data
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            return;
          }
          
          if (profile) {
            console.log('Profile fetched during auth state change:', profile);
            
            // Explicit check for superadmin role
            let userRole: UserRole = 'client';
            if (profile.role === 'superadmin') {
              console.log('User is a superadmin!');
              userRole = 'superadmin';
            } else if (profile.role === 'admin') {
              userRole = 'admin';
            }
            
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: profile.name || '',
              role: userRole,
              organization: profile.organization
            });
            
            console.log('User role set to:', userRole);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimer);
      window.removeEventListener('auth:forceReset', handleForceReset);
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        try {
          // Get user profile
          // FIXED QUERY - The previous syntax might have issues
          console.log('Fetching profile for user ID:', data.user.id);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            
            // If profile doesn't exist, create it
            if (profileError.code === 'PGRST116') {
              console.log('Profile not found, creating one...');
              
              // Default to client role if creating on the fly
              const defaultRole: UserRole = 'client';
              
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
                console.error('Error creating profile:', insertError);
                throw insertError;
              }
              
              const userWithNewProfile = {
                id: data.user.id,
                email: data.user.email || '',
                name: newProfile.name,
                role: newProfile.role as UserRole,
                organization: newProfile.organization
              };
              
              setUser(userWithNewProfile);
              
              // Redirect based on role
              navigate('/client');
              return;
            } else {
              throw profileError;
            }
          }
          
          // Debug output to see the exact profile data
          console.log('Retrieved profile:', profile);
          
          // Explicit check for superadmin role
          let userRole: UserRole = 'client';
          if (profile.role === 'superadmin') {
            console.log('User is a superadmin!');
            userRole = 'superadmin';
          } else if (profile.role === 'admin') {
            userRole = 'admin';
          }
          
          const userWithProfile = {
            id: data.user.id,
            email: data.user.email || '',
            name: profile.name || '',
            role: userRole,
            organization: profile.organization
          };
          
          console.log('User role set to:', userRole);
          setUser(userWithProfile);
          
          // Redirect based on role
          if (userRole === 'superadmin') {
            navigate('/superadmin');
          } else if (userRole === 'admin') {
            navigate('/admin');
          } else {
            navigate('/client');
          }
        } catch (profileErr) {
          // Fallback for severe errors - still log in but with minimal profile
          console.error('Critical profile error:', profileErr);
          
          // Create minimal user object from auth data
          const minimalUser = {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.name || email.split('@')[0],
            role: 'client' as UserRole
          };
          
          setUser(minimalUser);
          navigate('/client');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('Logging out...');
      
      // Clear local state
      setUser(null);
      
      // Clear all localStorage items that might hold state
      localStorage.removeItem('sb-fgnvobekfychilwomxij-auth-token');
      localStorage.removeItem('consenthub-auth');
      localStorage.removeItem('globalBranding');
      localStorage.removeItem('brandSettings');
      
      // Clear any other localStorage items to ensure clean state
      const localStorageKeys = Object.keys(localStorage);
      localStorageKeys.forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase') || key.includes('consent')) {
          localStorage.removeItem(key);
        }
      });
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      console.log('Successfully logged out');
      
      // Skip React navigation and directly force reload to the login page
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
      // Force reload to login page even if there's an error
      window.location.href = '/login';
    }
    // Don't use finally with setLoading here since we're reloading the page
  };

  // Signup function
  const signup = async (email: string, password: string, name: string, role: UserRole, organization?: string) => {
    setLoading(true);
    setError(null);
    
    // Check if we're on an admin page (creating a user for someone else)
    // or a signup page (creating a user for oneself)
    const isAdminCreatingUser = window.location.pathname.includes('/admin') || 
                              window.location.pathname.includes('/superadmin');
    
    console.log('Signup called from:', window.location.pathname, 'isAdminCreatingUser:', isAdminCreatingUser);
    
    try {
      // Store current user if admin is creating another user
      let currentUser = null;
      if (isAdminCreatingUser) {
        currentUser = user;
        console.log('Admin is creating a user, preserving current user session');
      }
      
      // Create user in Supabase - use admin API if available
      let userData;
      let userError;
      
      if (isAdminCreatingUser && window.location.pathname.includes('/superadmin')) {
        // Create user without signing in as that user
        console.log('Creating user with admin.createUser');
        try {
          // Use a direct API call to create user without signing in
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/admin/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            },
            body: JSON.stringify({
              email,
              password,
              email_confirm: true,
              user_metadata: { name, role, organization }
            })
          });
          
          if (!response.ok) {
            throw new Error(`Failed to create user: ${response.statusText}`);
          }
          
          const createdUser = await response.json();
          userData = { user: createdUser };
        } catch (adminError) {
          console.error('Admin user creation failed, falling back to standard signup:', adminError);
          // Fall back to standard signup
          const result = await supabase.auth.signUp({
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
          userData = result.data;
          userError = result.error;
        }
      } else {
        // Standard signup
        const result = await supabase.auth.signUp({
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
        userData = result.data;
        userError = result.error;
      }
      
      if (userError) {
        throw userError;
      }
      
      if (userData.user) {
        // Create profile record in profiles table
        const { data: profileData, error: profileError } = await supabase
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
          
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          
          // Check if this is just a duplicate profile error
          if (profileError.code === '23505') { // unique_violation
            console.log('Profile already exists');
          } else {
            throw profileError;
          }
        }
        
        // If admin is creating a user, restore the admin's session
        if (isAdminCreatingUser && currentUser) {
          console.log('Restoring admin user session');
          setUser(currentUser);
          return { success: true, userId: userData.user.id };
        }
        
        // Otherwise, this is self-signup, set the new user
        if (!isAdminCreatingUser) {
          const newUser: User = {
            id: userData.user.id,
            email,
            name,
            role,
            organization
          };
          
          setUser(newUser);
          
          // Redirect based on role for self-signup
          if (role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/client');
          }
        }
        
        return { success: true, userId: userData.user.id };
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
      return { success: false, error: err };
    } finally {
      setLoading(false);
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
