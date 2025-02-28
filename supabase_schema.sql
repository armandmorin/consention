-- Create the global_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.global_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  settings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Add comments for better documentation
COMMENT ON TABLE public.global_settings IS 'Stores global application settings like branding';
COMMENT ON COLUMN public.global_settings.type IS 'Type of settings (e.g., branding, email, etc.)';
COMMENT ON COLUMN public.global_settings.settings IS 'JSON blob of settings data';

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_global_settings_type ON public.global_settings(type);

-- Enable RLS
ALTER TABLE public.global_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY IF NOT EXISTS "Allow full access to superadmins" 
ON public.global_settings 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'superadmin'
  )
);

CREATE POLICY IF NOT EXISTS "Allow read access to admins" 
ON public.global_settings 
FOR SELECT
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'superadmin')
  )
);
