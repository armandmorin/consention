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

## Common Issues and Solutions

### 1. Session Lost on Refresh

If sessions are lost on page refresh:
- Check browser localStorage for the correct auth token
- Verify Supabase client configuration in supabase.ts
- Check AuthContext.tsx for session handling issues

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
