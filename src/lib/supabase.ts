import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create the Supabase client with persistent session storage
// This ensures sessions persist correctly between page refreshes
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'supabase.auth.token',
    autoRefreshToken: true,
    detectSessionInUrl: true,
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