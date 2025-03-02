# Clerk.com Setup Instructions

This application uses Clerk.com for authentication. Follow these steps to set up Clerk for this project:

## 1. Create a Clerk Account

If you don't already have a Clerk account, sign up at [clerk.com](https://clerk.com/).

## 2. Create a New Application

1. Go to the Clerk Dashboard
2. Click "Add Application"
3. Name your application (e.g., "Consent Management Dashboard")
4. Configure your application settings

## 3. Set Up Authentication Options

1. In your Clerk application dashboard, go to "Authentication" > "Social Connections"
2. Enable the social login providers you want (Google, GitHub, etc.)
3. Also enable Email/Password authentication in the "Email & Phone" section

## 4. Configure User Management

1. Go to "User Management" > "User & Authentication"
2. Configure email verification requirements
3. Set password policies
4. Enable/configure multi-factor authentication if needed

## 5. Configure Application Settings

1. Go to the "Instance Settings" section
2. Add your application domain(s) in "Allowed Origins"
   ```
   http://localhost:5173
   ```
3. Add the following to your "Redirect URLs"
   ```
   http://localhost:5173/login
   http://localhost:5173/callback
   ```

## 6. Get API Keys

From the Clerk dashboard:

1. Go to "API Keys"
2. Copy your "Publishable Key"

## 7. Configure the Application

Update the `.env` file with your Clerk API key:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 8. Setting Up User Roles (Optional)

Clerk offers user metadata to store custom user information like roles:

1. Create a webhook or backend function that runs when a user signs up
2. After user creation, set the appropriate role in their metadata
3. Create an API endpoint that can update user roles

```javascript
// Example of setting user metadata with Clerk Node SDK
await clerk.users.updateUser(userId, {
  publicMetadata: {
    role: 'client' // or 'admin', 'superadmin'
  }
});
```

## 9. Testing Authentication

After setting up Clerk, you can test the authentication by:

1. Running the application locally
2. Navigating to the login page
3. Creating a new account or signing in
4. Verifying that you're redirected to the appropriate dashboard
5. Testing that protected routes work correctly

## 10. Important Note About Database Setup

Your Supabase database has a foreign key constraint where:
- The `profiles` table's `id` field must reference an existing ID in the `auth.users` table
- This means profiles can only be created for users who exist in Supabase Auth

With this hybrid Clerk + Supabase setup, there are a few ways to handle this:

### Option 1: For Development/Testing
1. **Manual User Creation**: 
   - First create users in Supabase Auth (via the UI or API)
   - Then create matching users in Clerk with the same email address
   - The app will link them via email

### Option 2: For Production
1. **Create a Custom Users Table**:
   - Create a new table (e.g., `clerk_users`) without foreign key constraints
   - Store user data there instead of in the `profiles` table
   - Modify the app to use this table

2. **Use a Backend Service**:
   - Create a backend endpoint that handles user creation in both systems
   - When creating a user in Clerk, also create the corresponding user in Supabase Auth
   - Then create the profile record

## 11. Current Implementation

The current implementation:
1. Tries to find existing profiles by email address
2. If found, uses the profile data along with Clerk authentication
3. If not found, uses only Clerk data for the user
4. Does not attempt to create new profiles automatically due to the constraint

## Clerk and Supabase Integration

The integration between Clerk and Supabase happens in the AuthContext.tsx file:

1. Clerk handles authentication, sessions, and token management
2. When a user signs in via Clerk, we sync their information with the Supabase profiles table
3. For role management, we check and use the role stored in the Supabase profile
4. Protected routes use both Clerk's authentication state and our Supabase role information

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [React SDK Documentation](https://clerk.com/docs/quickstarts/react)
- [Clerk + Supabase](https://clerk.com/docs/integrations/databases/supabase)