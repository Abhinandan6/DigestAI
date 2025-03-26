import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Explicitly define environment variables
      'process.env.VITE_NHOST_SUBDOMAIN': JSON.stringify(env.VITE_NHOST_SUBDOMAIN),
      'process.env.VITE_NHOST_REGION': JSON.stringify(env.VITE_NHOST_REGION),
      'process.env.VITE_N8N_API_URL': JSON.stringify(env.VITE_N8N_API_URL),
      'process.env.VITE_N8N_API_KEY': JSON.stringify(env.VITE_N8N_API_KEY),
      'process.env.VITE_N8N_WEBHOOK_URL': JSON.stringify(env.VITE_N8N_WEBHOOK_URL),
      'process.env.VITE_N8N_REFRESH_WEBHOOK_URL': JSON.stringify(env.VITE_N8N_REFRESH_WEBHOOK_URL)
    },
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
  };
});
