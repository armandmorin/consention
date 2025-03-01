import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Add global type declaration for our temporary override
declare global {
  interface Window {
    __supabaseAuthInitialized?: boolean;
    __supabaseAuthChecking?: boolean;
    __supabaseAuthSuccess?: boolean;
    __temporarySuperAdminOverride?: {
      id: string;
      email: string;
      role: string;
      name: string;
      organization?: string;
    };
  }
}

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

// Create a completely new persistent session manager that uses multiple strategies
export const SessionManager = {
  // Initialize when the app starts
  init: async () => {
    try {
      // First try to get cookies as they are more reliable
      document.cookie.split(';').some(cookie => {
        if (cookie.trim().startsWith('sb-auth=')) {
          console.log('Found supabase cookie - we should have a session');
        }
      });
      
      // Create a direct flag in window to track status 
      window.__supabaseAuthInitialized = true;
      window.__supabaseAuthChecking = true;
      
      // Double-strategy approach - try refreshing session first
      console.log('SessionManager: Initializing with refresh strategy...');
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (!refreshError && refreshData.session) {
        console.log('SessionManager: Session refreshed successfully');
        
        // Store in multiple places for maximum persistence
        try {
          // Store in sessionStorage as a backup
          sessionStorage.setItem('supabase_access_token', refreshData.session.access_token);
          
          // Store in indexedDB as another backup
          if (window.indexedDB) {
            const request = window.indexedDB.open('supabaseAuthBackup', 1);
            request.onupgradeneeded = (event) => {
              const db = event.target.result;
              if (!db.objectStoreNames.contains('tokens')) {
                db.createObjectStore('tokens', { keyPath: 'id' });
              }
            };
            
            request.onsuccess = (event) => {
              const db = event.target.result;
              const transaction = db.transaction(['tokens'], 'readwrite');
              const store = transaction.objectStore('tokens');
              
              store.put({
                id: 'current',
                access_token: refreshData.session.access_token,
                refresh_token: refreshData.session.refresh_token,
                timestamp: Date.now()
              });
            };
          }
        } catch (storageErr) {
          console.error('Error with backup storage:', storageErr);
        }
        
        // Set status flags
        window.__supabaseAuthChecking = false;
        window.__supabaseAuthSuccess = true;
        
        return true;
      }
      
      // If refresh failed, try direct session check
      console.log('SessionManager: Refresh failed, trying getSession...');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (!sessionError && sessionData.session) {
        console.log('SessionManager: Found active session');
        
        // Backup the session tokens
        sessionStorage.setItem('supabase_access_token', sessionData.session.access_token);
        
        // Set status flags
        window.__supabaseAuthChecking = false;
        window.__supabaseAuthSuccess = true;
        
        return true;
      }
      
      // Fallback mode - check localStorage manually
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.currentSession?.access_token) {
            console.log('SessionManager: Found token in localStorage, trying to set manually');
            
            // Try to manually set the session as last resort
            const { error: setError } = await supabase.auth.setSession({
              access_token: parsed.currentSession.access_token,
              refresh_token: parsed.currentSession.refresh_token || ''
            });
            
            if (!setError) {
              console.log('SessionManager: Manual session set successful!');
              window.__supabaseAuthChecking = false;
              window.__supabaseAuthSuccess = true;
              return true;
            }
          }
        } catch (parseErr) {
          console.error('Error parsing stored session:', parseErr);
        }
      }
      
      // All strategies failed
      window.__supabaseAuthChecking = false;
      window.__supabaseAuthSuccess = false;
      return false;
    } catch (err) {
      console.error('SessionManager: Critical error initializing:', err);
      window.__supabaseAuthChecking = false;
      window.__supabaseAuthSuccess = false;
      return false;
    }
  },
  
  // Enhanced restore session function using multiple fallbacks
  restore: async () => {
    try {
      // Try each strategy in sequence for maximum reliability
      
      // Strategy 1: Default getSession from Supabase
      console.log('SessionManager restore: trying getSession...');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (!sessionError && sessionData.session) {
        console.log('SessionManager: Session restored from Supabase');
        return true;
      }
      
      // Strategy 2: Try refresh
      console.log('SessionManager restore: trying refreshSession...');
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (!refreshError && refreshData.session) {
        console.log('SessionManager: Session refreshed successfully');
        return true;
      }
      
      // Strategy 3: Try sessionStorage backup
      const backupToken = sessionStorage.getItem('supabase_access_token');
      if (backupToken) {
        console.log('SessionManager: Trying sessionStorage token...');
        const { error: setError } = await supabase.auth.setSession({ 
          access_token: backupToken, 
          refresh_token: '' 
        });
        
        if (!setError) {
          console.log('SessionManager: Session restored from sessionStorage');
          return true;
        }
      }
      
      // Strategy 4: Try IndexedDB backup
      if (window.indexedDB) {
        return new Promise((resolve) => {
          try {
            console.log('SessionManager: Trying IndexedDB backup...');
            const request = window.indexedDB.open('supabaseAuthBackup', 1);
            
            request.onerror = () => {
              console.error('Error opening IndexedDB');
              resolve(false);
            };
            
            request.onsuccess = async (event) => {
              try {
                const db = event.target.result;
                const transaction = db.transaction(['tokens'], 'readonly');
                const store = transaction.objectStore('tokens');
                const getRequest = store.get('current');
                
                getRequest.onsuccess = async () => {
                  if (getRequest.result && getRequest.result.access_token) {
                    const { error } = await supabase.auth.setSession({
                      access_token: getRequest.result.access_token,
                      refresh_token: getRequest.result.refresh_token || ''
                    });
                    
                    if (!error) {
                      console.log('SessionManager: Session restored from IndexedDB');
                      resolve(true);
                    } else {
                      console.error('Failed to set session from IndexedDB:', error);
                      resolve(false);
                    }
                  } else {
                    console.log('No valid token found in IndexedDB');
                    resolve(false);
                  }
                };
                
                getRequest.onerror = () => {
                  console.error('Error getting token from IndexedDB');
                  resolve(false);
                };
              } catch (dbErr) {
                console.error('Error in IndexedDB transaction:', dbErr);
                resolve(false);
              }
            };
          } catch (idbErr) {
            console.error('IndexedDB overall error:', idbErr);
            resolve(false);
          }
        });
      }
      
      // Strategy 5: Final manual localStorage check
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.currentSession?.access_token) {
            console.log('SessionManager: Last attempt with localStorage token');
            
            const { error } = await supabase.auth.setSession({
              access_token: parsed.currentSession.access_token,
              refresh_token: parsed.currentSession.refresh_token || ''
            });
            
            if (!error) {
              console.log('SessionManager: Session restored from localStorage parse');
              return true;
            }
          }
        }
      } catch (e) {
        console.error('Error in final localStorage attempt:', e);
      }
      
      // All strategies failed
      console.log('SessionManager: All session restoration strategies failed');
      return false;
    } catch (err) {
      console.error('SessionManager: Critical error in restore:', err);
      return false;
    }
  },
  
  // Force role check - a new strategy to verify superadmin access
  forceSuperAdminCheck: async () => {
    try {
      console.log('Performing direct superadmin role check...');
      
      // First try to force refresh the session
      await supabase.auth.refreshSession();
      
      // Get the current user - this should reflect the refreshed session
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        console.error('No user found in forceSuperAdminCheck');
        return false;
      }
      
      // Get the user's profile to check role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, name, email, organization')
        .eq('id', userData.user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile in superadmin check:', profileError);
        
        // IMPORTANT: Try one more fallback with direct SQL query
        try {
          console.log('Attempting superadmin check with direct query...');
          
          // This special query should bypass RLS
          const { data: directData, error: directError } = await supabase.rpc('is_user_superadmin', {
            user_id: userData.user.id
          });
          
          if (!directError && directData === true) {
            console.log('Direct RPC confirms user is superadmin');
            
            // Create a proper user session with correct role
            // Update auth context manually
            window.__temporarySuperAdminOverride = {
              id: userData.user.id,
              email: userData.user.email || '',
              role: 'superadmin',
              name: userData.user.email?.split('@')[0] || 'Admin',
            };
            
            // Broadcast an event for the auth context
            window.dispatchEvent(new CustomEvent('auth:manualProfileUpdate', {
              detail: {
                id: userData.user.id,
                email: userData.user.email,
                role: 'superadmin'
              }
            }));
            
            return true;
          }
        } catch (rpcError) {
          console.error('RPC error:', rpcError);
        }
        
        return false;
      }
      
      // Verify superadmin role
      if (profile && profile.role === 'superadmin') {
        console.log('Direct check confirms user is superadmin');
        
        // Update auth context manually
        window.__temporarySuperAdminOverride = {
          id: userData.user.id,
          email: userData.user.email || '',
          role: 'superadmin',
          name: profile.name || userData.user.email?.split('@')[0] || 'Admin',
          organization: profile.organization
        };
        
        // Broadcast an event for the auth context
        window.dispatchEvent(new CustomEvent('auth:manualProfileUpdate', {
          detail: {
            id: userData.user.id,
            email: userData.user.email,
            role: 'superadmin',
            profile: profile
          }
        }));
        
        return true;
      } else {
        console.log('User is not a superadmin:', profile?.role);
        return false;
      }
    } catch (err) {
      console.error('Error in superadmin force check:', err);
      return false;
    }
  }
}