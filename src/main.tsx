// Ensure React is explicitly imported and available globally
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App'
import { clerkConfig } from './lib/clerk'

console.log('App mounting with Clerk authentication')

// Render the app with Clerk Provider
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={clerkConfig.publishableKey}
      navigate={(to) => window.location.href = to}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
)