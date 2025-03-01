// Ensure React is explicitly imported and available globally
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// Basic session persistence check on page load
const checkPersistedSession = () => {
  try {
    const PROJECT_ID = 'fgnvobekfychilwomxij';
    const STORAGE_KEY = `sb-${PROJECT_ID}-auth-token`;
    
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const data = JSON.parse(storedData);
      console.log('Found persisted session for:', data?.user?.email || 'unknown user');
    } else {
      console.log('No persisted session found in localStorage');
    }
  } catch (e) {
    console.error('Error checking persisted session:', e);
  }
};

// Check session state on load before React even starts
checkPersistedSession();

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)