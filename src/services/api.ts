import { supabase } from '../lib/supabase';
import { User } from '../contexts/AuthContext';

// Branding related functions
export interface BrandingSettings {
  id?: string;
  organization_id: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  font_family?: string;
}

export const getBrandingSettings = async (organizationId: string): Promise<BrandingSettings | null> => {
  const { data, error } = await supabase
    .from('branding_settings')
    .select('*')
    .eq('organization_id', organizationId)
    .single();
    
  if (error) {
    console.error('Error fetching branding settings:', error);
    return null;
  }
  
  return data;
};

export const updateBrandingSettings = async (settings: BrandingSettings): Promise<BrandingSettings | null> => {
  // Check if settings already exist
  const { data: existing } = await supabase
    .from('branding_settings')
    .select('id')
    .eq('organization_id', settings.organization_id)
    .single();
    
  let result;
  
  if (existing) {
    // Update existing settings
    const { data, error } = await supabase
      .from('branding_settings')
      .update(settings)
      .eq('id', existing.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating branding settings:', error);
      return null;
    }
    
    result = data;
  } else {
    // Create new settings
    const { data, error } = await supabase
      .from('branding_settings')
      .insert([settings])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating branding settings:', error);
      return null;
    }
    
    result = data;
  }
  
  return result;
};

// Storage related functions for images
export const uploadLogo = async (file: File, userId: string): Promise<string | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-logo-${Date.now()}.${fileExt}`;
  const filePath = `logos/${fileName}`;
  
  // Upload the file to Supabase Storage
  const { error } = await supabase.storage
    .from('branding')
    .upload(filePath, file);
    
  if (error) {
    console.error('Error uploading logo:', error);
    return null;
  }
  
  // Get the public URL
  const { data } = supabase.storage
    .from('branding')
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};

// Analytics related functions
export interface AnalyticsEvent {
  client_id: string;
  event_type: string;
  event_data?: Record<string, any>;
}

export const recordAnalyticsEvent = async (event: AnalyticsEvent): Promise<boolean> => {
  const { error } = await supabase
    .from('analytics')
    .insert([event]);
    
  if (error) {
    console.error('Error recording analytics event:', error);
    return false;
  }
  
  return true;
};

export const getAnalytics = async (clientId?: string, startDate?: Date, endDate?: Date) => {
  let query = supabase
    .from('analytics')
    .select('*');
    
  // Filter by client if provided
  if (clientId) {
    query = query.eq('client_id', clientId);
  }
  
  // Filter by date range if provided
  if (startDate) {
    query = query.gte('created_at', startDate.toISOString());
  }
  
  if (endDate) {
    query = query.lte('created_at', endDate.toISOString());
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching analytics:', error);
    return [];
  }
  
  return data;
};

// User management functions
export const getUsers = async (organizationFilter?: string) => {
  let query = supabase
    .from('profiles')
    .select('*');
    
  if (organizationFilter) {
    query = query.eq('organization', organizationFilter);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  
  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
  
  return data;
};