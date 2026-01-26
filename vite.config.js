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
   headers: {
  "Content-Security-Policy": "default-src 'self'; script-src 'self' https://checkout.razorpay.com https://cdn.jsdelivr.net 'unsafe-eval' 'sha256-Z2/iFzh9VMlVkEOar1f/oSHWwQk3ve1qk/C2WdsC4Xk=' ; style-src 'self' 'unsafe-inline'; img-src 'self' https://api.dicebear.com http://localhost:5174 https://dy4nbj6hy5kkk.cloudfront.net data: blob: ; connect-src 'self' https://lumberjack.razorpay.com http://localhost:4000 ws://localhost:5173 http://localhost:5173; worker-src 'self' http://localhost:5174 blob:; script-src-elem 'self' https://checkout.razorpay.com https://cdn.jsdelivr.net 'sha256-Z2/iFzh9VMlVkEOar1f/oSHWwQk3ve1qk/C2WdsC4Xk='; frame-src 'self' https://api.razorpay.com;",
},
  },
})

