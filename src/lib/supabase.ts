import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create the Supabase client with absolute minimal configuration
// We're using the default settings which are known to work correctly
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// Simple function to check if a user has a valid session
export const hasValidSession = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession()
    return !error && data.session !== null
  } catch {
    return false
  }
}