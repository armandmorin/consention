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