import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/routes': 'http://localhost:5000',
      '/compliance': 'http://localhost:5000',
      '/banking': 'http://localhost:5000',
      '/pools': 'http://localhost:5000'
    }
  }
})
