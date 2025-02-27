-- Check current role for the user
SELECT id, email, role FROM profiles WHERE email = 'armandmorin@gmail.com';

-- Update the user to have the superadmin role
UPDATE profiles 
SET role = 'superadmin' 
WHERE email = 'armandmorin@gmail.com';

-- Verify user now has superadmin role
SELECT id, email, role FROM profiles WHERE email = 'armandmorin@gmail.com';

-- If the above doesn't work, try this approach instead:
-- Get the user ID from auth.users and use it to update the profiles table
UPDATE profiles
SET role = 'superadmin'
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'armandmorin@gmail.com'
);

-- Make sure RLS isn't blocking access to the superadmin profile
-- This policy should already exist from previous script, but adding it explicitly
DROP POLICY IF EXISTS "SuperAdmins can view all profiles" ON profiles;
CREATE POLICY "SuperAdmins can view all profiles" 
ON profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin'
  )
);

-- Check if the profile exists - if not, create it
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