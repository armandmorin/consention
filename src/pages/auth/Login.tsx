import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface LocationState {
  message?: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const message = state?.message;
  
  // Handle redirections and cleanup on component mount
  useEffect(() => {
    let isMounted = true;
    console.log('Login page loaded, checking auth state');
    
    // Redirect authenticated users
    const redirectIfLoggedIn = () => {
      if (user && isMounted) {
        console.log(`User already logged in as ${user.role}, redirecting...`);
        // Use a microtask to ensure we don't redirect during render
        Promise.resolve().then(() => {
          if (!isMounted) return;
          
          if (user.role === 'superadmin') {
            navigate('/superadmin');
          } else if (user.role === 'admin') {
            navigate('/admin');
          } else if (user.role === 'client') {
            navigate('/client');
          }
        });
      }
    };
    
    // Add a safety timeout to ensure auth loading is reset
    const safetyTimer = setTimeout(() => {
      if (loading && isMounted) {
        console.warn('Login page: Auth loading state was stuck, forcing reset');
        const resetEvent = new CustomEvent('auth:forceReset', {
          bubbles: true,
          cancelable: true,
          detail: { source: 'LoginPage', timestamp: Date.now() }
        });
        window.dispatchEvent(resetEvent);
      }
    }, 3000);
    
    // Check immediately in case we already have user data
    redirectIfLoggedIn();
    
    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      console.log('Login page unmounted');
    };
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Form submitted, calling login...');
      await login(email, password);
    } catch (err) {
      console.error('Login form error:', err);
      // Reset form on error for a better user experience
      setPassword('');
      // Force reset loading state if there's an error
      window.dispatchEvent(new Event('auth:forceReset'));
    }
  };

  // Local loading state to avoid using context loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modified submit handler that uses local state
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent multiple submissions
    
    try {
      setIsSubmitting(true);
      console.log('Form submitted, calling login...');
      await login(email, password);
      
      // Check if there was an error after login attempt
      if (error) {
        console.log('Login returned with error:', error);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Login form error:', err);
      setPassword('');
      setIsSubmitting(false);
      // Force reset the auth loading state if there's an error
      window.dispatchEvent(new Event('auth:forceReset'));
    } finally {
      // Safety timeout to reset button state if login takes too long
      setTimeout(() => {
        setIsSubmitting(false);
      }, 5000);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/admin/signup" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message && (
            <div className="mb-4 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{message}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo accounts</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Super Admin:</p>
                <code className="text-xs bg-gray-100 p-1 rounded">superadmin@example.com / password</code>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Admin:</p>
                <code className="text-xs bg-gray-100 p-1 rounded">admin@example.com / password</code>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Client:</p>
                <code className="text-xs bg-gray-100 p-1 rounded">client@example.com / password</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
