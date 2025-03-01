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

  // Initialize user from Supabase session - Completely rewritten for reliability
  useEffect(() => {
    console.log('Auth provider mounted - setting up authentication');
    
    // Function to check localStorage for auth token
  const checkStoredAuth = () => {
    try {
      // Get the storage key
      const PROJECT_ID = import.meta.env.VITE_SUPABASE_URL.split('//')[1].split('.')[0];
      const STORAGE_KEY = `sb-${PROJECT_ID}-auth-token`;
      
      // Check for stored session
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        console.log('Found stored session in localStorage');
        return true;
      } else {
        console.log('No stored session found in localStorage');
        return false;
      }
    } catch (err) {
      console.error('Error checking stored auth:', err);
      return false;
    }
  };
    
    // Check for stored auth
    const hasStoredAuth = checkStoredAuth();
    
    // If we have stored auth, manually try to refresh the session
    if (hasStoredAuth) {
      // Create variable for cleanup
      const refreshAborted = { aborted: false };
      
      // Non-async call to refresh the session
      supabase.auth.refreshSession().then(({ data, error }) => {
        if (refreshAborted.aborted) return;
        
        if (!error && data.session) {
          console.log('Successfully refreshed session on mount');
        } else if (error) {
          console.error('Failed to refresh session on mount:', error);
        }
      }).catch(err => {
        if (!refreshAborted.aborted) {
          console.error('Unexpected error refreshing session:', err);
        }
      });
    }
    
    // Function to fetch user profile data 
    const fetchUserProfile = async (userId: string): Promise<any> => {
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
    
    // Process authenticated user data
    const processAuthenticatedUser = async (userId: string, email: string) => {
      console.log('Processing authenticated user:', email);
      
      // For all users, fetch their profile from database
      const profile = await fetchUserProfile(userId);
      
      if (profile) {
        console.log('Found user profile:', profile);
        
        // Determine user role from profile
        let userRole: UserRole = 'client';
        if (profile.role === 'superadmin') {
          console.log('User is a superadmin!');
          userRole = 'superadmin';
        } else if (profile.role === 'admin') {
          console.log('User is an admin!');
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
        // Session exists but no profile found (unusual case)
        console.warn('Session exists but no profile found! Creating minimal user');
        
        // Create a minimal user with default client privileges
        setUser({
          id: userId,
          email: email || '',
          name: email?.split('@')[0] || 'User',
          role: 'client',
          organization: null
        });
      }
      
      setLoading(false);
    };
    
    // Main function to check for an active session
    const checkForActiveSession = async () => {
      try {
        console.log('Checking for active Supabase session...');
        setLoading(true);
        
        // Get current session from Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
          setLoading(false);
          return;
        }
        
        // If we have a valid session, process the user
        if (data.session) {
          console.log('Found active session for:', data.session.user.email);
          console.log('User ID:', data.session.user.id);
          
          // Force fetch the current user's profile
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.session.user.id)
              .single();
            
            if (profileError) {
              console.error('Error fetching profile after session check:', profileError);
              setUser(null);
              setLoading(false);
              return;
            }
            
            if (profile) {
              console.log('Found user profile directly:', profile);
              
              // Determine user role from profile
              let userRole: UserRole = 'client';
              if (profile.role === 'superadmin') {
                console.log('User is a superadmin!');
                userRole = 'superadmin';
              } else if (profile.role === 'admin') {
                console.log('User is an admin!');
                userRole = 'admin';
              }
              
              setUser({
                id: data.session.user.id,
                email: data.session.user.email || '',
                name: profile.name || '',
                role: userRole,
                organization: profile.organization
              });
              setLoading(false);
              return;
            }
          } catch (profileErr) {
            console.error('Unexpected error fetching profile:', profileErr);
          }
          
          // If direct profile fetch failed, try the standard process
          await processAuthenticatedUser(
            data.session.user.id, 
            data.session.user.email || ''
          );
        } else {
          // No active session
          console.log('No active session found');
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
        setLoading(false);
      }
    };
    
    // Set up auth state change listener FIRST (this is important)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in:', session.user.email);
          setLoading(true);
          await processAuthenticatedUser(
            session.user.id,
            session.user.email || ''
          );
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
          // No need to update state, just log it
        }
      }
    );
    
    // Add a safety timeout to ensure loading state is reset
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading state was stuck for 5 seconds, forcing it to false');
        // Use a functional update to prevent race conditions
        setLoading(prevLoading => {
          if (prevLoading) {
            console.log('Safety timer: Resetting loading state');
            return false;
          }
          return prevLoading;
        });
      }
    }, 5000);
    
    // Listen for force reset events from other components
    const handleForceReset = (event: Event) => {
      // Cast to CustomEvent to access detail property
      const customEvent = event as CustomEvent;
      console.log('Received force reset event, resetting auth loading state', 
                 customEvent.detail ? `from ${customEvent.detail.source}` : '');
      
      // Use functional update to prevent race conditions
      setLoading(prevLoading => {
        if (prevLoading) {
          console.log('Force reset: Changing loading state from true to false');
          return false;
        }
        return prevLoading;
      });
    };
    
    window.addEventListener('auth:forceReset', handleForceReset);
    
    // Check for active session immediately
    checkForActiveSession();
    
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
      
      // Authenticate with Supabase
      console.log('Authenticating with Supabase...');
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
            // Continue anyway with a minimal user
            const minimalUser = {
              id: data.user.id,
              email: data.user.email || '',
              name: email.split('@')[0],
              role: 'client' as UserRole
            };
            
            setUser(minimalUser);
            setLoading(false); // Set loading to false before redirect
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
          setLoading(false); // Set loading to false before redirect
          navigate('/client');
          return;
        }
        
        // For other profile errors, log detailed error and try to recover
        console.error('Profile fetch error details:', {
          code: profileError.code, 
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint
        });
        
        // Try a more direct approach with a raw query
        try {
          console.log('Attempting raw profile lookup for:', data.user.id);
          const { data: rawProfile, error: rawError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id);
            
          console.log('Raw profile lookup result:', rawProfile, rawError);
          
          if (rawProfile && Array.isArray(rawProfile) && rawProfile.length > 0 && !rawError) {
            // We got a profile via direct query, use it
            const firstProfile = rawProfile[0];
            console.log('Using first profile from direct query:', firstProfile);
            
            const userWithRawProfile = {
              id: data.user.id,
              email: data.user.email || '',
              name: firstProfile.name || email.split('@')[0],
              role: (firstProfile.role as UserRole) || 'client',
              organization: firstProfile.organization
            };
            
            setUser(userWithRawProfile);
            setLoading(false);
            
            // Redirect based on role
            if (userWithRawProfile.role === 'superadmin') {
              navigate('/superadmin');
            } else if (userWithRawProfile.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/client');
            }
            return;
          }
        } catch (rpcError) {
          console.error('RPC lookup failed:', rpcError);
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
        setLoading(false); // Set loading to false before redirect
        navigate('/client');
        return;
      }
      
      // Profile exists, set up user with role
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
      setLoading(false); // Ensure loading is set to false on error
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('Logging out...');
      
      // Clear local state first
      setUser(null);
      
      // Clear any UI-related settings
      localStorage.removeItem('brandSettings');
      
      // Sign out from Supabase - this will clear the auth token
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
          const sessionData = await supabase.auth.getSession();
          
          // Check if we have a valid session with access token
          if (!sessionData.data.session?.access_token) {
            throw new Error('No valid session found to perform admin operation');
          }
          
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/admin/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${sessionData.data.session.access_token}`
            },
            body: JSON.stringify({
              email,
              password,
              email_confirm: true,
              user_metadata: { name, role, organization }
            })
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create user: ${response.status} ${response.statusText} - ${errorText}`);
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
