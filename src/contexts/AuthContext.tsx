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
    // Function to fetch user profile
    const fetchUserProfile = async (userId: string) => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return null;
        }
        
        return profile;
      } catch (e) {
        console.error('Exception fetching profile:', e);
        return null;
      }
    };
    
    // Function to set up user from profile data
    const setupUserFromProfile = (userId: string, email: string, profile: any) => {
      // Determine user role
      let userRole: UserRole = 'client';
      if (profile && profile.role === 'superadmin') {
        console.log('User is a superadmin!');
        userRole = 'superadmin';
      } else if (profile && profile.role === 'admin') {
        userRole = 'admin';
      }
      
      // Create user object
      const userData = {
        id: userId,
        email: email || '',
        name: profile?.name || email.split('@')[0],
        role: userRole,
        organization: profile?.organization
      };
      
      // Save to state
      setUser(userData);
      return userData;
    };
    
    // Primary session check function
    const checkSession = async () => {
      try {
        setLoading(true);
        console.log('Checking authentication session...');
        
        // First, try to get the session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (session) {
          console.log('Found active session, user ID:', session.user.id);
          
          // Get user profile
          const profile = await fetchUserProfile(session.user.id);
          
          if (profile) {
            console.log('Found user profile:', profile);
            const userData = setupUserFromProfile(session.user.id, session.user.email || '', profile);
            
            // No need to store in localStorage as Supabase handles persistence
            console.log('User set up successfully:', userData.role);
          } else {
            // Session exists but no profile - create minimal user
            console.warn('Session exists but no profile found');
            const userData = setupUserFromProfile(
              session.user.id, 
              session.user.email || '', 
              null
            );
            console.log('Created minimal user from session');
          }
        } else {
          console.log('No active session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Error in session check:', error);
        setUser(null);
      } finally {
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
    try {
      setLoading(true);
      setError(null);
      
      console.log('Login attempt for:', email);
      
      // Step 1: Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Supabase auth error:', error);
        throw error;
      }
      
      if (!data.session) {
        console.error('Authentication succeeded but no session was returned');
        throw new Error('Authentication problem: No session returned');
      }
      
      console.log('Authentication successful, session established');
      
      // Step 2: Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      // Handle profile fetch results
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
            // Continue anyway with a minimal user
            const minimalUser = {
              id: data.user.id,
              email: data.user.email || '',
              name: email.split('@')[0],
              role: 'client' as UserRole
            };
            
            setUser(minimalUser);
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
          
          // Redirect to client dashboard
          navigate('/client');
          return;
        }
        
        // For other profile errors, continue with minimal user info
        const minimalUser = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || email.split('@')[0],
          role: 'client' as UserRole
        };
        
        setUser(minimalUser);
        navigate('/client');
        return;
      }
      
      // Step 3: If profile exists, set up user with role and redirect accordingly
      console.log('User profile found:', profile);
      
      // Determine user role
      let userRole: UserRole = 'client';
      if (profile.role === 'superadmin') {
        console.log('User is a superadmin!');
        userRole = 'superadmin';
      } else if (profile.role === 'admin') {
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
      
      // Clear settings
      localStorage.removeItem('globalBranding');
      localStorage.removeItem('brandSettings');
      
      // Sign out from Supabase (this should clear session cookies/storage)
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
