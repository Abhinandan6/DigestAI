import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port,
      host: '127.0.0.1',
      open, // Opens browser automatically
      hmr, // Simplified HMR config
    },
    define: {
      // Simplified environment variable handling
      __VITE_NHOST_SUBDOMAIN__: JSON.stringify(env.VITE_NHOST_SUBDOMAIN),
      __VITE_NHOST_REGION__: JSON.stringify(env.VITE_NHOST_REGION),
      __VITE_N8N_API_URL__: JSON.stringify(env.VITE_N8N_API_URL),
      __VITE_N8N_API_KEY__: JSON.stringify(env.VITE_N8N_API_KEY),
      __VITE_N8N_WEBHOOK_URL__: JSON.stringify(env.VITE_N8N_WEBHOOK_URL),
      __VITE_N8N_REFRESH_WEBHOOK_URL__: JSON.stringify(env.VITE_N8N_REFRESH_WEBHOOK_URL)
    },
    build: {
      chunkSizeWarningLimit,
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
  };
});
