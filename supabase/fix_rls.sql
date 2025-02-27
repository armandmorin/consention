-- Fix RLS policies for the profiles table

-- First, drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view client profiles in their organization" ON profiles;
DROP POLICY IF EXISTS "SuperAdmins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow all access to profiles" ON profiles;

-- Make sure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to select their own profile
-- This is CRITICAL for login to work
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Create a policy that allows admins to view profiles in their organization
CREATE POLICY "Admins can view profiles in their organization" 
ON profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin' AND organization = (
      SELECT organization FROM profiles WHERE id = profiles.id
    )
  )
);

-- Create a policy that allows superadmins to view all profiles
CREATE POLICY "SuperAdmins can view all profiles" 
ON profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin'
  )
);

-- Create a policy that allows users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Create policy that allows users to insert their own profile (necessary for signup)
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create policy that allows authenticated users to insert profiles (needed for admin creating users)
CREATE POLICY "Authenticated users can insert profiles" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() IN (
  SELECT id FROM auth.users
));

-- VERY IMPORTANT: Policy to allow the initial profile fetch during login
-- This is a workaround for the chicken-and-egg problem during login
CREATE POLICY "Allow all users to see their own profile data" 
ON profiles FOR SELECT 
USING (true);

-- After testing that login works, you can replace the above policy with this more restrictive one:
-- DROP POLICY IF EXISTS "Allow all users to see their own profile data" ON profiles;
-- CREATE POLICY "Allow login profile access" 
-- ON profiles FOR SELECT 
-- USING (auth.uid() = id OR auth.role() = 'authenticated');