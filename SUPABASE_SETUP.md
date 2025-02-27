# Supabase Setup Guide

This guide walks through the process of setting up Supabase for the ConsentHub application.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Supabase CLI](https://supabase.io/docs/guides/cli) (optional for local development)

## Setup Steps

### 1. Create a Supabase Project

1. Go to [https://app.supabase.io](https://app.supabase.io) and sign in
2. Click "New Project"
3. Enter a name for your project
4. Set a secure database password
5. Choose a region closest to your users
6. Click "Create new project"

### 2. Get Your Supabase Credentials

Once your project is created:

1. Go to Project Settings > API
2. Copy the "URL" (this is your `VITE_SUPABASE_URL`)
3. Copy the "anon" key (this is your `VITE_SUPABASE_ANON_KEY`)

### 3. Configure Environment Variables

1. Create a `.env.local` file in the root of your project if it doesn't exist already
2. Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 4. Run Database Migrations

#### Option 1: Using the Supabase Dashboard

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/migrations/20250227_initial_schema.sql`
3. Paste into the SQL editor and run the query

#### Option 2: Using Supabase CLI (for local development)

1. Install Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```
2. Initialize Supabase:
   ```bash
   supabase init
   ```
3. Link to your remote project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
4. Push the migrations:
   ```bash
   supabase db push
   ```

### 5. Set Up Storage Buckets

1. In the Supabase dashboard, go to Storage
2. Create a new bucket called "branding"
3. Set the bucket's privacy setting to "Public"
4. Update bucket policies to allow authenticated users to upload files

### 6. Configure Email Authentication

1. In the Supabase dashboard, go to Authentication > Providers
2. Enable Email provider
3. Configure any email templates as needed
4. Set up your site URL for redirects

## Database Schema

The application uses the following tables:

1. **profiles** - User profile information
2. **branding_settings** - Organization branding configuration
3. **analytics** - Analytics data

See the SQL migration file for the complete schema definition.

## Row Level Security (RLS) Policies

Our application uses RLS policies to secure data based on user roles:

- SuperAdmins can access all data
- Admins can access data for their organization
- Clients can only access their own data

The SQL migration includes these policies.

## Initial User Setup

To create your first superadmin user:

1. Register a user through the app (or directly via Supabase Auth)
2. In the Supabase SQL editor, run:
   ```sql
   UPDATE profiles
   SET role = 'superadmin'
   WHERE email = 'your_email@example.com';
   ```

## Testing the Setup

After configuring Supabase and updating your application code:

1. Run the application:
   ```bash
   npm run dev
   ```
2. Try registering a new user
3. Verify that authentication works
4. Check that you can upload and retrieve data