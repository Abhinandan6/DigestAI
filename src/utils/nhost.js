import { NhostClient } from '@nhost/nhost-js';

const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN || 'pmdddjhfyuqnpddamxhh',
  region: import.meta.env.VITE_NHOST_REGION || 'ap-south-1',
  clientStorageType: 'localStorage',
});

console.log('Nhost client initialized with:', {
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
  region: import.meta.env.VITE_NHOST_REGION
});

export default nhost;
