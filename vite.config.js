import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), legacy({
    targets: ['defaults', 'Android >= 7'],
  })],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your Backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

