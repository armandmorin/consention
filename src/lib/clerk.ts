// Clerk configuration options
export const clerkConfig = {
  // The publishable key from your Clerk.dev dashboard
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  
  // The sign-in and sign-up URLs can be customized
  signInUrl: '/login',
  signUpUrl: '/admin/signup',
  
  // After sign in/up, Clerk will redirect to this URL by default
  afterSignInUrl: '/dashboard',
  afterSignUpUrl: '/dashboard',
  
  // Will try to redirect users when they sign out
  navigateAfterSignOut: '/login',
};