import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client with persistent sessions and storage options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    // Keep the original storage key to maintain compatibility with existing sessions
    storageKey: 'sb-fgnvobekfychilwomxij-auth-token',
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
})