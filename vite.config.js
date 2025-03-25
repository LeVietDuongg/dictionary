import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Ensure environment variables are properly loaded
  envPrefix: 'VITE_',
  // Provide clear error message for missing environment variables
  define: {
    __APP_ENV__: JSON.stringify(process.env.NODE_ENV),
  },
  server: {
    // Add CORS headers for API requests
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
