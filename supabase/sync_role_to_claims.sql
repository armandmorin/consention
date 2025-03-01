-- Create a function to sync profile role to JWT claims
CREATE OR REPLACE FUNCTION public.sync_user_role_to_claims()
RETURNS TRIGGER AS $$
BEGIN
  -- Update app_metadata in auth.users which affects JWT claims
  UPDATE auth.users 
  SET raw_app_meta_data = 
    raw_app_meta_data || 
    jsonb_build_object('role', NEW.role::TEXT)
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

-- For existing users, update their app_metadata directly
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN SELECT id, role FROM public.profiles LOOP
    -- Update app_metadata
    UPDATE auth.users 
    SET raw_app_meta_data = 
      raw_app_meta_data || 
      jsonb_build_object('role', profile_record.role::TEXT)
    WHERE id = profile_record.id;
  END LOOP;
END;
$$;
