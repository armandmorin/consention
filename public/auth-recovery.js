// Superadmin emergency access script
// This runs before React loads to ensure consistent access across page refreshes
(function() {
  console.log('Auth recovery script running');
  
  // Check if we're in the superadmin area or might be redirected there
  if (window.location.pathname.startsWith('/superadmin') || sessionStorage.getItem('redirectPath')?.startsWith('/superadmin')) {
    console.log('Superadmin area detected - checking for emergency bypass');
    
    try {
      // Dynamically determine the project ID from any Supabase token
      let storageKey = null;
      
      // Try to find the storage key by looking at localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
          storageKey = key;
          console.log('Found Supabase auth token:', storageKey);
          break;
        }
      }
      
      // If we couldn't find it, use the hardcoded one as fallback
      if (!storageKey) {
        const PROJECT_ID = 'fgnvobekfychilwomxij';
        storageKey = `sb-${PROJECT_ID}-auth-token`;
        console.log('Using hardcoded storage key:', storageKey);
      }
      
      // Check the auth token for armandmorin@gmail.com
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const data = JSON.parse(stored);
        if (data?.user?.email === 'armandmorin@gmail.com') {
          console.log('Emergency bypass activated for armandmorin@gmail.com');
          
          // Set both session indicators with longer expiration
          sessionStorage.setItem('is_armand_session', 'true');
          sessionStorage.setItem('force_superadmin_access', 'true');
          
          // Create a global access flag
          window.SUPERADMIN_ACCESS_GRANTED = true;
          
          // Also fire a custom event to notify any listeners
          try {
            const event = new CustomEvent('auth:specialAccessGranted', {
              detail: { email: 'armandmorin@gmail.com' }
            });
            window.dispatchEvent(event);
          } catch (eventError) {
            console.error('Error dispatching event:', eventError);
          }
        }
      }
    } catch (e) {
      console.error('Error in emergency bypass check:', e);
    }
  }
})();