// Superadmin emergency access script
// This runs before React loads to ensure consistent access across page refreshes
(function() {
  console.log('Auth recovery script running');
  
  // Check if we're in the superadmin area
  if (window.location.pathname.startsWith('/superadmin')) {
    console.log('Superadmin area detected - checking for emergency bypass');
    
    try {
      // Check if the user email is armandmorin@gmail.com
      const PROJECT_ID = 'fgnvobekfychilwomxij';
      const STORAGE_KEY = `sb-${PROJECT_ID}-auth-token`;
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (stored) {
        const data = JSON.parse(stored);
        if (data?.user?.email === 'armandmorin@gmail.com') {
          console.log('Emergency bypass activated for armandmorin@gmail.com');
          
          // Set both session indicators
          sessionStorage.setItem('is_armand_session', 'true');
          sessionStorage.setItem('force_superadmin_access', 'true');
          
          // Create a global access flag
          window.SUPERADMIN_ACCESS_GRANTED = true;
        }
      }
    } catch (e) {
      console.error('Error in emergency bypass check:', e);
    }
  }
})();