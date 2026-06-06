import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    // Ensure VITE_API_BASE is properly set in the build
    'process.env.VITE_API_BASE': JSON.stringify(
      process.env.VITE_API_BASE || 'https://netviz3d-backend.onrender.com'
    ),
  },
})
