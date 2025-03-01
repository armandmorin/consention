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

// Create the Supabase client with default configuration
// This will use persistSession=true, autoRefreshToken=true by default
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// Simple session check without any special handling
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

// Helper function to get user role from JWT claims
export const getUserRoleFromSession = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getSession()
    
    if (error || !data.session) {
      return null
    }
    
    // First try to get role from app_metadata (JWT claims)
    const role = data.session.user.app_metadata?.role
    
    if (role) {
      return role
    }
    
    // If not in JWT, try to get from database
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.session.user.id)
      .single()
      
    if (profileError || !profileData) {
      return null
    }
    
    return profileData.role
  } catch (err) {
    console.error('Error getting user role:', err)
    return null
  }
}