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
    // Check current session
    const checkSession = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user profile data from profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            throw profileError;
          }
          
          // Combine auth and profile data
          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: profile.name || '',
              role: profile.role || 'client',
              organization: profile.organization
            });
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };
    
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
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: profile.name || '',
              role: profile.role || 'client',
              organization: profile.organization
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
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
          
          const userWithProfile = {
            id: data.user.id,
            email: data.user.email || '',
            name: profile.name || '',
            role: profile.role as UserRole,
            organization: profile.organization
          };
          
          setUser(userWithProfile);
          
          // Redirect based on role
          if (userWithProfile.role === 'superadmin') {
            navigate('/superadmin');
          } else if (userWithProfile.role === 'admin') {
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
      setLoading(true);
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Set user to null in our state
      setUser(null);
      // Navigate to login page
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string, role: UserRole, organization?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
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
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Create profile record in profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name,
              role,
              organization,
              email
            }
          ])
          .select()
          .single();
          
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          
          // Check if this is just a duplicate profile error
          if (profileError.code === '23505') { // unique_violation
            console.log('Profile already exists, retrieving existing profile');
            
            // Get the existing profile
            const { data: existingProfile, error: fetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
              
            if (fetchError) {
              console.error('Error fetching existing profile:', fetchError);
              throw fetchError;
            }
            
            // Use the existing profile
            const existingUser: User = {
              id: data.user.id,
              email,
              name: existingProfile.name,
              role: existingProfile.role,
              organization: existingProfile.organization
            };
            
            setUser(existingUser);
            
            // Redirect based on role
            if (existingUser.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/client');
            }
            return;
          } else {
            throw profileError;
          }
        }
        
        // Profile created successfully
        const newUser: User = {
          id: data.user.id,
          email,
          name,
          role,
          organization
        };
        
        setUser(newUser);
        
        // Redirect based on role
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/client');
        }
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
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
