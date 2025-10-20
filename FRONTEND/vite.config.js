import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
<<<<<<< HEAD
        target: 'http://localhost:5002',
        changeOrigin: true,
      },
      '/protected': {
        target: 'http://localhost:5002',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://localhost:5002',
        changeOrigin: true,
      },
      '/warehouse': {
        target: 'http://localhost:5002',
        changeOrigin: true,
      },
      '/reports': {
        target: 'http://localhost:5002',
=======
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/protected': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/warehouse': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/shifts': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/reports': {
        target: 'http://localhost:5000',
>>>>>>> d11cca6 (first commit)
        changeOrigin: true,
      },
    }
  }
})
