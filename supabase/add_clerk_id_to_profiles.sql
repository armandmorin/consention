-- Add clerk_id column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS clerk_id text;

-- Create index on clerk_id for faster lookups
CREATE INDEX IF NOT EXISTS profiles_clerk_id_idx ON profiles(clerk_id);

-- Create index on email for faster lookups (if not already existing)
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);