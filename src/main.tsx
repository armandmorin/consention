import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// Using StrictMode is fine now that we have the Vercel routing configuration
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
