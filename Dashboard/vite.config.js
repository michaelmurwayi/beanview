import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 0.0.0.0 access
    port: 5173,
    strictPort: true,
    allowedHosts: [
      '.ngrok-free.app', // any ngrok subdomain
      '.ngrok.io',       // old ngrok domains
      'localhost',
      '127.0.0.1',
    ],
  },
})
