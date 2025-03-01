// Ensure React is explicitly imported and available globally
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App'
import { auth0Config } from './lib/auth0'

console.log('App mounting with Auth0 configuration')

// Render the app with Auth0Provider
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={auth0Config.authorizationParams}
      cacheLocation={auth0Config.cacheLocation as any}
      onRedirectCallback={auth0Config.onRedirectCallback}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
)