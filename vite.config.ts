import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // This ensures React is always in scope for JSX
      jsxRuntime: 'automatic',
      // Add React import to JSX files automatically
      jsxImportSource: 'react',
    })
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['lucide-react'],
  },
  build: {
    // Ensure proper chunk size and code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
})
