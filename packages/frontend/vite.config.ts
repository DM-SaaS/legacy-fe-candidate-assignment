import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    cors: true,
  },
  preview: {
    port: 5173,
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          dynamic: ['@dynamic-labs/sdk-react-core', '@dynamic-labs/ethereum'],
          utils: ['axios', 'react-hook-form', 'zod'],
        },
      },
    },
  },
})
