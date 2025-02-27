-- Method 1: Create a new superadmin user through Supabase auth API
-- IMPORTANT: This won't work directly in SQL Editor - use Supabase Dashboard or API

-- Instead, use the Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Invite user" or "Add new user"
-- 3. Add email: armandmorin@gmail.com and password: Dnamra1970_98

-- Alternatively, you can use the Supabase JavaScript client in your app:
/*
const { data, error } = await supabase.auth.admin.createUser({
  email: 'armandmorin@gmail.com',
  password: 'Dnamra1970_98',
  email_confirm: true,
  user_metadata: { name: 'Armand Morin' }
})
*/

-- Then insert into profiles with superadmin role
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
WHERE email = 'armandmorin@gmail.com';

-- Method 2: Alternative approach using Supabase Auth API
-- Use this approach through the Supabase dashboard by:
-- 1. Go to Authentication > Users in Supabase dashboard
-- 2. Click "Add User" to create user with email and password
-- 3. Then run only this SQL in the SQL Editor:

UPDATE profiles
SET role = 'superadmin'
WHERE email = 'armandmorin@gmail.com';

-- Method 3: Debugging - check if user exists
-- Run these queries to check what's going on:

-- Check if user exists in auth.users
SELECT * FROM auth.users WHERE email = 'armandmorin@gmail.com';

-- Check if user exists in profiles
SELECT * FROM profiles WHERE email = 'armandmorin@gmail.com';