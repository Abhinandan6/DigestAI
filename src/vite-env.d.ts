/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NHOST_SUBDOMAIN: string
  readonly VITE_NHOST_REGION: string
  readonly VITE_N8N_API_URL: string
  readonly VITE_N8N_API_KEY: string
  readonly VITE_N8N_WEBHOOK_URL: string
  readonly VITE_N8N_REFRESH_WEBHOOK_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}