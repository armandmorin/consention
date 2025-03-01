import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Determine the correct storage key
const PROJECT_ID = supabaseUrl.split('//')[1].split('.')[0];
const STORAGE_KEY = `sb-${PROJECT_ID}-auth-token`;

// Log the storage key for debugging
console.log('Supabase storage key:', STORAGE_KEY);

// Helper to add persistent auth before any request
const addPersistentAuth = async () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { currentSession } = JSON.parse(stored);
      if (currentSession?.access_token) {
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error('Error checking stored session:', err);
    return false;
  }
};

// Create the Supabase client with enhanced session persistence
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: STORAGE_KEY,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-v2'
    },
    // Add fetch interceptor to ensure auth is loaded
    fetch: async (url, options = {}) => {
      await addPersistentAuth();
      return fetch(url, options);
    }
  }
})

// Enhanced session check with error handling
export const hasValidSession = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Session check error:', error)
      return false
    }
    
    // Return true only if we have a valid session
    return data && data.session !== null
  } catch (err) {
    console.error('Unexpected error checking session:', err)
    return false
  }
}

// Create a simplified session manager with better error handling
export const SessionManager = {
  // Initialize when the app starts - simpler and more reliable
  init: async () => {
    try {
      console.log('SessionManager: Initializing...');
      
      // Try Supabase's built-in getSession first 
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('SessionManager: Error getting session:', error);
        return false;
      }
      
      if (data && data.session) {
        console.log('SessionManager: Found active session');
        console.log('SessionManager: User info:', {
          id: data.session.user.id,
          email: data.session.user.email,
          app_metadata: data.session.user.app_metadata,
        });
        
        // Session exists, no need for further initialization
        return true;
      }
      
      console.log('SessionManager: No active session found');
      return false;
    } catch (err) {
      console.error('SessionManager: Critical error initializing:', err);
      return false;
    }
  },
  
  // Simple restore function that focuses on Supabase's built-in functionality
  restore: async () => {
    try {
      console.log('SessionManager: Restoring session...');
      
      // First try refreshing the token
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (!refreshError && refreshData.session) {
        console.log('SessionManager: Successfully refreshed session');
        return true;
      }
      
      if (refreshError) {
        console.log('SessionManager: Refresh failed:', refreshError);
      }
      
      // If refresh fails, check current session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('SessionManager: Error getting session:', error);
        return false;
      }
      
      if (data && data.session) {
        console.log('SessionManager: Found existing session');
        return true;
      }
      
      // No session available
      console.log('SessionManager: No session found to restore');
      return false;
    } catch (err) {
      console.error('SessionManager: Error restoring session:', err);
      return false;
    }
  },
  
  // Special function for armandmorin@gmail.com
  isArmandMorin: () => {
    try {
      // First check session storage for persistent flag
      if (sessionStorage.getItem('is_armand_session') === 'true') {
        return true;
      }
      
      // Check if the user is armandmorin@gmail.com based on localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return data?.user?.email === 'armandmorin@gmail.com';
      }
      return false;
    } catch (e) {
      console.error('Error checking special user:', e);
      return false;
    }
  }
}