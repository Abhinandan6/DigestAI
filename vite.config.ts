import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            '@apollo/client',
            '@nhost/react',
            '@nhost/react-apollo'
          ],
          'nhost': ['@nhost/nhost-js'],
          'ui': ['lucide-react']
        }
      }
    }
  }
});
