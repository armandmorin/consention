-- Function to check if a user is a superadmin
-- This function can be called via RPC and bypasses RLS
CREATE OR REPLACE FUNCTION public.is_user_superadmin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- Executes with the privileges of the function owner
AS $$
DECLARE
  user_role text;
BEGIN
  -- Get the user's role directly from the profiles table
  SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
  
  -- Return true if the user is a superadmin
  RETURN user_role = 'superadmin';
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_user_superadmin TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_user_superadmin TO anon;
