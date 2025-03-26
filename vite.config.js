import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api/news': {
        target: 'https://n8n-dev.subspace.money/webhook-test/news-flow',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/news/, '')
      },
      '/api/refresh': {
        target: 'https://n8n-dev.subspace.money/webhook-test/refresh-news',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/refresh/, '')
      }
    }
  }
})
