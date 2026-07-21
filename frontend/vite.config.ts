import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (/react-router-dom|\/react-dom\/|\/react\//.test(id)) return 'vendor-react';
            if (/framer-motion|\/gsap\/|\/lenis\//.test(id)) return 'vendor-animation';
          }
        },
      },
    },
  },
})
