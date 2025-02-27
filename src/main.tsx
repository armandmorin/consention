// Ensure React is explicitly imported and available globally
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// Make React available in the global scope for compatibility
window.React = React;

// Using StrictMode is fine now that we have the Vercel routing configuration
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
