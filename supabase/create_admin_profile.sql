-- IMPORTANT: Fix profile issues

-- 1. Check if the user exists in auth.users
SELECT id, email FROM auth.users WHERE email = 'armandmorin@gmail.com';

-- 2. Temporarily disable RLS for profiles table to allow direct inserts
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 3. Create or update the profile for the user
-- Replace 'af0e1cbc-062d-4d6b-a297-118549c02cdb' with your actual user ID from auth.users
INSERT INTO profiles (
  id, 
  email, 
  name, 
  role, 
  created_at, 
  updated_at
)
VALUES (
  'af0e1cbc-062d-4d6b-a297-118549c02cdb',  -- Replace with your actual user ID
  'armandmorin@gmail.com',
  'Armand Morin',
  'superadmin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE 
SET role = 'superadmin', 
    name = 'Armand Morin', 
    updated_at = NOW();

-- 4. Verify the profile was created correctly
SELECT * FROM profiles WHERE email = 'armandmorin@gmail.com';

-- 5. Re-enable RLS but create a policy that allows unrestricted SELECT (for testing)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create bypass policy for testing
CREATE POLICY "Unrestricted Select For Testing"
ON profiles FOR SELECT
USING (true);

-- 6. Test query that your app is using
SELECT * FROM profiles WHERE id = 'af0e1cbc-062d-4d6b-a297-118549c02cdb';