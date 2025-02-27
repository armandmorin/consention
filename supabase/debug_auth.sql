-- Debugging script for authentication issues

-- 1. Check if profiles table exists with correct structure
SELECT table_name, column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'profiles';

-- 2. Check if the authenticated user exists in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'armandmorin@gmail.com';

-- 3. Check if the user has a corresponding entry in profiles
SELECT * 
FROM profiles 
WHERE email = 'armandmorin@gmail.com';

-- 4. Check RLS policies on profiles table
SELECT * 
FROM pg_policies 
WHERE tablename = 'profiles';

-- 5. FIX: Ensure profile exists for the user
INSERT INTO profiles (
  id,
  email,
  name,
  role
)
SELECT 
  id,
  'armandmorin@gmail.com',
  'Armand Morin',
  'superadmin'
FROM auth.users
WHERE email = 'armandmorin@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'superadmin';

-- 6. FIX: Temporarily disable RLS to test if that's the issue
-- WARNING: Only use this for testing, then re-enable it
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 7. After testing, re-enable RLS
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 8. FIX: Create a policy that allows everyone to see all profiles (for testing)
CREATE POLICY "Allow all access to profiles" 
ON profiles 
USING (true)
WITH CHECK (true);