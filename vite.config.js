import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',  // Allows external access
    port: 5173,  // Make sure it matches your running port
    strictPort: true,
    allowedHosts: ['.codeanywhere.com'], // Allow any CodeAnywhere domain
  },
  plugins: [react() , tailwindcss()],
})
