# Authentication System Maintenance

This document outlines key aspects of the authentication system and how to maintain it.

## Session Management

The authentication system uses Supabase for session management with these key files:

1. `src/lib/supabase.ts` - Creates the Supabase client and manages session persistence
2. `src/contexts/AuthContext.tsx` - Manages user authentication state and profile data
3. `src/components/SuperAdminRoute.tsx` - Protects superadmin routes

## Storage Key

The storage key for authentication tokens follows this pattern:
```
sb-{project-id}-auth-token
```

Where `project-id` is extracted from your Supabase URL.

## Multi-Level Authentication System

The app uses a robust multi-level authentication strategy:

1. Primary authentication via Supabase auth system:
   - Handles login/logout
   - Manages user session in localStorage
   - Refreshes tokens automatically

2. Enhanced session persistence with multiple storage methods:
   - LocalStorage (default Supabase storage)
   - SessionStorage backup for secondary retrieval
   - IndexedDB for more persistent offline storage
   - Manual token parsing and restoration

3. Fallback direct database permission check:
   - Added for SuperAdmin routes specifically
   - Directly queries the database to verify permissions
   - Bypasses normal auth flow if it fails

## Common Issues and Solutions

### 1. Session Lost on Refresh

The core issue was that the Supabase JWT token contained role: "authenticated" while the user profile in the database had role: "superadmin". This mismatch caused authentication issues on page refresh because:

1. When logging in initially, we fetch the profile and use the role from there
2. After a refresh, the JWT token is restored first with just "authenticated" role
3. Then profile fetch happens later, creating a race condition

**Proper Fix**: 
We created a database trigger that automatically syncs the role from profiles table to the JWT claims. This ensures that when you log in or refresh, your role is always consistent.

To apply the fix:
1. Run the SQL script in `/supabase/sync_role_to_claims.sql` on your Supabase database
2. This creates a trigger that keeps JWT claims in sync with profile roles
3. It also updates all existing users' JWT claims to match their profile roles

After this fix, JWT tokens will include the correct role (e.g., "superadmin"), making the refresh issue disappear permanently.

### 2. Blob URL Issues with Images

Blob URLs are temporary and don't persist across page loads:
- Use data URLs instead of blob URLs (current implementation)
- Store images in sessionStorage for persistence

### 3. Database Table Issues

If you see 404/406 errors about global_settings:
- Run the SQL script in fixed_supabase_schema.sql to create table
- Check RLS policies to ensure proper access

## Required Tables

The app requires these database tables:
1. `auth.users` - Standard Supabase auth table
2. `profiles` - Stores user profiles with role field
3. `global_settings` - Stores app settings like branding

## Making Someone a Superadmin

To make a user a superadmin, run this SQL:

```sql
UPDATE profiles
SET role = 'superadmin'
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'user@example.com'
);
```
