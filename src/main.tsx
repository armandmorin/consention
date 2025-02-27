import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// CRITICAL FIX: Removed duplicate routing configuration
// The routes were defined in both App.tsx and main.tsx, causing
// double initialization of auth providers and route components

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
