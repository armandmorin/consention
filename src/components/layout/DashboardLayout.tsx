import React, { ReactNode, useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  Shield, 
  Menu, 
  X, 
  Home, 
  Users, 
  Settings, 
  BarChart2, 
  Code, 
  LogOut, 
  Bell, 
  User
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, loading } = useAuth();
  
  // Simple authentication check
  useEffect(() => {
    // Only redirect if we're definitely not logged in
    if (!loading && user === null) {
      navigate('/login');
    }
  }, [user, loading, navigate]);
  
  // Determine user type from URL
  const isSuperAdmin = location.pathname.includes('/superadmin');
  const isAdmin = location.pathname.includes('/admin') && !isSuperAdmin;
  const isClient = location.pathname.includes('/client');
  
  // Use React Router navigation for internal links
  const handleNavigation = useCallback((href: string, e: React.MouseEvent) => {
    e.preventDefault();  // Prevent default link behavior
    navigate(href);
  }, [navigate]);
  
  // Use the logout function from AuthContext
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Logging out from DashboardLayout');
    logout();
  };
  
  // Navigation items based on user type
  const navigation = isSuperAdmin 
    ? [
        { name: 'Dashboard', href: '/superadmin', icon: Home },
        { name: 'Admin Management', href: '/superadmin/admins', icon: Users },
        { name: 'Global Branding', href: '/superadmin/branding', icon: Settings },
        { name: 'Analytics', href: '/superadmin/analytics', icon: BarChart2 },
      ]
    : isAdmin
    ? [
        { name: 'Dashboard', href: '/admin', icon: Home },
        { name: 'Client Management', href: '/admin/clients', icon: Users },
        { name: 'Branding Settings', href: '/admin/branding', icon: Settings },
        { name: 'Code Generator', href: '/admin/code', icon: Code },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
      ]
    : [
        { name: 'Dashboard', href: '/client', icon: Home },
        { name: 'Analytics', href: '/client/analytics', icon: BarChart2 },
      ];

  // No loading state detection needed anymore
  
  // Enhanced loading state that shows more debugging info
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
        <p className="text-gray-600 text-sm">Loading dashboard...</p>
      </div>
    );
  }
  
  // Show a different message if we're not authenticated at all
  if (!user) {
    // Redirect will happen in useEffect
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-red-600 mb-2">Authentication required</p>
        <p className="text-gray-600 text-sm">Redirecting to login...</p>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-0 flex z-40 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-shrink-0 flex items-center px-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">ConsentHub</span>
          </div>
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavigation(item.href, e)}
                    className={`group flex items-center px-2 py-2 w-full text-left text-base font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent
                      className={`mr-4 h-6 w-6 ${
                        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b border-gray-200">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ConsentHub</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 bg-white space-y-1">
                {navigation.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleNavigation(item.href, e)}
                      className={`group flex items-center px-2 py-2 w-full text-left text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <IconComponent
                        className={`mr-3 h-6 w-6 ${
                          isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative flex items-center">
                <div className="flex items-center">
                  <div className="mr-2">
                    <button
                      type="button"
                      className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      id="user-menu"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                    </button>
                  </div>
                  <button
                    onClick={(e) => handleLogout(e)}
                    className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
