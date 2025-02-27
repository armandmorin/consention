import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

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

// Mock user data for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'superadmin@example.com',
    name: 'Super Admin',
    role: 'superadmin'
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    organization: 'Example Corp'
  },
  {
    id: '3',
    email: 'client@example.com',
    name: 'Client User',
    role: 'client',
    organization: 'Client Company'
  }
];

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize user directly from localStorage
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error('Error initializing user from localStorage:', e);
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Keep user state in sync with localStorage
  useEffect(() => {
    console.log('AuthContext initialized with user:', user ? `${user.name} (${user.role})` : 'none');
    
    // Set up storage event listener to keep auth in sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        if (e.newValue) {
          try {
            const newUser = JSON.parse(e.newValue);
            console.log('User updated in another tab, syncing state');
            setUser(newUser);
          } catch (error) {
            console.error('Error parsing user from storage event:', error);
          }
        } else {
          console.log('User removed in another tab, logging out');
          setUser(null);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser && password === 'password') {
        setUser(foundUser);
        
        // Store user in localStorage with explicit error handling
        try {
          localStorage.setItem('user', JSON.stringify(foundUser));
          console.log('User successfully stored in localStorage after login');
        } catch (storageError) {
          console.error('Failed to store user in localStorage:', storageError);
        }
        
        // Redirect based on role
        if (foundUser.role === 'superadmin') {
          navigate('/superadmin');
        } else if (foundUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/client');
        }
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    console.log('Logout function called - clearing user state and removing from localStorage');
    // Important: Set user to null BEFORE removing from localStorage
    setUser(null);
    // Only remove auth-related localStorage items
    localStorage.removeItem('user');
    // Navigate AFTER state updates
    setTimeout(() => navigate('/login'), 0);
  };

  // Signup function
  const signup = async (email: string, password: string, name: string, role: UserRole, organization?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        email,
        name,
        role,
        organization
      };
      
      // In a real app, you would send this to your API
      // For now, we'll just simulate success
      
      setUser(newUser);
      // Store user in localStorage with explicit error handling
      try {
        localStorage.setItem('user', JSON.stringify(newUser));
        console.log('New user successfully stored in localStorage after signup');
      } catch (storageError) {
        console.error('Failed to store new user in localStorage:', storageError);
      }
      
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/client');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists
      const userExists = mockUsers.some(u => u.email === email);
      
      if (!userExists) {
        throw new Error('No account found with this email');
      }
      
      // In a real app, you would send a password reset email
      // For now, we'll just simulate success
      
      navigate('/login', { state: { message: 'Password reset email sent' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (token: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would validate the token and update the password
      // For now, we'll just simulate success
      
      navigate('/login', { state: { message: 'Password reset successful' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
