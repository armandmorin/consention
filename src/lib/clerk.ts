// Clerk configuration options
export const clerkConfig = {
  // The publishable key from your Clerk.dev dashboard
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  
  // The sign-in and sign-up URLs can be customized
  signInUrl: '/login',
  signUpUrl: '/admin/signup',
  
  // After sign in/up, Clerk will redirect to these URLs by default
  // We'll handle more specific redirects in our auth context
  afterSignInUrl: '/login',  // We'll redirect from here based on role
  afterSignUpUrl: '/login',  // We'll redirect from here based on role
  
  // Will try to redirect users when they sign out
  navigateAfterSignOut: '/login',
};