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

// Create a persistent session manager
export const SessionManager = {
  // Initialize when the app starts
  init: async () => {
    try {
      // First check storage 
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        console.log('SessionManager: Found stored session data')
        
        // Force refresh the session token
        const { data, error } = await supabase.auth.refreshSession()
        if (error) {
          console.error('SessionManager: Failed to refresh token:', error)
          return false
        }
        
        if (data.session) {
          console.log('SessionManager: Session refreshed successfully')
          
          // Store access token in sessionStorage as an additional backup
          sessionStorage.setItem('supabase_access_token', data.session.access_token)
          return true
        }
      }
      
      // Check for existing session
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        console.log('SessionManager: Active session exists')
        sessionStorage.setItem('supabase_access_token', data.session.access_token)
        return true
      }
      
      return false
    } catch (err) {
      console.error('SessionManager: Error initializing:', err)
      return false
    }
  },
  
  // Restore session from any available storage
  restore: async () => {
    try {
      // Try to get session from Supabase
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        console.log('SessionManager: Session restored from Supabase')
        return true
      }
      
      // Try to restore from backup in sessionStorage
      const backupToken = sessionStorage.getItem('supabase_access_token')
      if (backupToken) {
        console.log('SessionManager: Attempting to restore from backup token')
        const { error } = await supabase.auth.setSession({ access_token: backupToken, refresh_token: '' })
        
        if (!error) {
          console.log('SessionManager: Session restored from backup token')
          return true
        } else {
          console.error('SessionManager: Failed to restore from backup token:', error)
        }
      }
      
      return false
    } catch (err) {
      console.error('SessionManager: Error restoring session:', err)
      return false
    }
  }
}