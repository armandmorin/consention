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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
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
        localStorage.setItem('user', JSON.stringify(foundUser));
        
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
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
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
      localStorage.setItem('user', JSON.stringify(newUser));
      
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
