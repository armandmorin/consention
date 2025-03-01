-- Create function for JWT role syncing
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Get the role from profiles table
  DECLARE
    user_role text;
  BEGIN
    SELECT role INTO user_role FROM public.profiles WHERE id = NEW.id;
    
    -- Set the role in user metadata
    IF user_role IS NOT NULL THEN
      -- Update the user's app_metadata to include role
      UPDATE auth.users
      SET raw_app_meta_data = 
        CASE
          WHEN raw_app_meta_data IS NULL THEN 
            jsonb_build_object('role', user_role)
          ELSE
            raw_app_meta_data || jsonb_build_object('role', user_role)
        END
      WHERE id = NEW.id;
    END IF;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to sync role changes with JWT claims
CREATE OR REPLACE TRIGGER on_profile_update
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create trigger to add role to JWT claims on new profile creation
CREATE OR REPLACE TRIGGER on_profile_create
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Sync existing users (run this once)
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN SELECT * FROM public.profiles
  LOOP
    -- Update the user's app_metadata to include role
    UPDATE auth.users
    SET raw_app_meta_data = 
      CASE
        WHEN raw_app_meta_data IS NULL THEN 
          jsonb_build_object('role', profile_record.role)
        ELSE
          raw_app_meta_data || jsonb_build_object('role', profile_record.role)
      END
    WHERE id = profile_record.id;
  END LOOP;
END $$;

-- Check if roles are correctly set in JWT claims
SELECT au.id, au.email, p.role as profile_role, au.raw_app_meta_data->>'role' as jwt_role 
FROM auth.users au 
JOIN public.profiles p ON au.id = p.id;

-- Make sure armandmorin@gmail.com has superadmin role
UPDATE profiles
SET role = 'superadmin'
WHERE email = 'armandmorin@gmail.com';

-- Verify the update worked
SELECT id, email, role FROM profiles WHERE email = 'armandmorin@gmail.com';