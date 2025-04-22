import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/.netlify/functions/n8n-proxy': {
        target: 'http://localhost:5678',
        changeOrigin: true,
        rewrite: (path) => {
          // For development, directly proxy to n8n workflow execution endpoint
          return `/api/v1/workflows/oHJiPJxiJRgnJcIb/execute`;
        }
      }
    }
  }
})
