# Authentication Fix Documentation

## Problem
The application is experiencing authentication issues where:
1. User loses superadmin status after page refresh 
2. JWT tokens don't contain role information from the profile
3. Special handling was added for specific email addresses as a workaround

## Root Cause
The JWT tokens issued by Supabase don't automatically include custom claims from profile tables. This causes authentication state to be lost on refresh when using role-based authorization that relies on database values.

## Solution: Use Supabase JWT Custom Claims

This is how to properly implement role-based authentication with Supabase:

### 1. Create a Database Function with JWT Generation
```sql
-- Create a function that will be called on login
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
      SET raw_app_metadata = 
        CASE
          WHEN raw_app_metadata IS NULL THEN 
            jsonb_build_object('role', user_role)
          ELSE
            raw_app_metadata || jsonb_build_object('role', user_role)
        END
      WHERE id = NEW.id;
    END IF;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Create a Trigger to Update JWT Claims on Profile Changes
```sql
-- Create a trigger to run the function whenever a profile is updated
CREATE OR REPLACE TRIGGER on_profile_update
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create a trigger to run the function whenever a new profile is created
CREATE OR REPLACE TRIGGER on_profile_create
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### 3. Manually Sync Existing Users
```sql
-- Run this once to update existing users
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN SELECT * FROM public.profiles
  LOOP
    -- Update the user's app_metadata to include role
    UPDATE auth.users
    SET raw_app_metadata = 
      CASE
        WHEN raw_app_metadata IS NULL THEN 
          jsonb_build_object('role', profile_record.role)
        ELSE
          raw_app_metadata || jsonb_build_object('role', profile_record.role)
      END
    WHERE id = profile_record.id;
  END LOOP;
END $$;
```

### 4. Update Frontend Code to Use JWT Claims

Update your authorization logic to check for role in multiple places:

```typescript
// In SuperAdminRoute.tsx
const hasRole = (role: string): boolean => {
  // Check JWT claims first (reliable after implementing the solution)
  const session = supabase.auth.getSession();
  if (session?.user?.app_metadata?.role === role) {
    return true;
  }
  
  // Fallback to context user if available
  if (user?.role === role) {
    return true;
  }
  
  return false;
}
```

### 5. Remove All Special Email Handling

Once implemented, remove all special email handling code, including:
- Special checks for 'armandmorin@gmail.com'
- The auth-recovery.js script 
- All sessionStorage and special flags

## Testing the Solution
1. Run the SQL scripts to set up JWT claim handling
2. Log in as a superadmin user
3. Refresh the page
4. Verify that you still have superadmin access
5. Check the JWT token contents in developer tools to confirm role is included

## Conclusion
This solution addresses the root cause by making the role information part of the JWT token itself, ensuring that role information persists across page refreshes without needing any special handling.