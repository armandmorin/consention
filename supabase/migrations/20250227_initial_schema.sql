-- Create profiles table for user metadata
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL CHECK (role IN ('superadmin', 'admin', 'client')),
  organization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage for images
CREATE SCHEMA IF NOT EXISTS storage;

-- Create table for branding settings
CREATE TABLE IF NOT EXISTS branding_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES profiles(id),
  logo_url TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  font_family TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for storing analytics data
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES profiles(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view client profiles in their organization" 
  ON profiles FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE role = 'admin' AND organization = (
        SELECT organization FROM profiles WHERE id = profiles.id
      )
    )
  );

CREATE POLICY "SuperAdmins can view all profiles" 
  ON profiles FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'superadmin'
    )
  );

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create RLS policies for branding_settings table
ALTER TABLE branding_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their organization's branding" 
  ON branding_settings FOR SELECT 
  USING (
    organization_id = auth.uid() OR
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE organization = (
        SELECT organization FROM profiles WHERE id = organization_id
      )
    )
  );

CREATE POLICY "Admins can update their organization's branding" 
  ON branding_settings FOR UPDATE 
  USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE role IN ('admin', 'superadmin') AND 
      organization = (
        SELECT organization FROM profiles WHERE id = organization_id
      )
    )
  );

-- Create RLS policies for analytics table
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their own analytics" 
  ON analytics FOR SELECT 
  USING (client_id = auth.uid());

CREATE POLICY "Admins can view analytics for clients in their organization" 
  ON analytics FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE role = 'admin' AND organization = (
        SELECT organization FROM profiles WHERE id = client_id
      )
    )
  );

CREATE POLICY "SuperAdmins can view all analytics" 
  ON analytics FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'superadmin'
    )
  );

-- Create function to handle updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at fields
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branding_updated_at
BEFORE UPDATE ON branding_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();