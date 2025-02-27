import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// Disable strict mode to prevent double mount/unmount cycles
// This can cause auth state to be lost during development
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
