-- Create a function to sync profile role to JWT claims
CREATE OR REPLACE FUNCTION public.sync_user_role_to_claims()
RETURNS TRIGGER AS $$
BEGIN
  -- This uses Supabase's auth.users table to set the JWT claim
  -- The role will be included in the JWT token on next refresh
  PERFORM auth.set_claim(NEW.id, 'role', NEW.role::TEXT);
  
  -- Also update app_metadata which can be accessed in frontend
  UPDATE auth.users 
  SET raw_app_meta_data = 
    raw_app_meta_data || 
    json_build_object('role', NEW.role::TEXT)::jsonb
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to run the function whenever a profile is updated
DROP TRIGGER IF EXISTS on_profile_update ON public.profiles;
CREATE TRIGGER on_profile_update
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_role_to_claims();

-- For existing users, update their claims
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN SELECT id, role FROM public.profiles LOOP
    PERFORM auth.set_claim(profile_record.id, 'role', profile_record.role::TEXT);
    
    -- Also update app_metadata
    UPDATE auth.users 
    SET raw_app_meta_data = 
      raw_app_meta_data || 
      json_build_object('role', profile_record.role::TEXT)::jsonb
    WHERE id = profile_record.id;
  END LOOP;
END;
$$;
