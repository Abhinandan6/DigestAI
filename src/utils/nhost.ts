import { NhostClient as OriginalNhostClient } from '@nhost/nhost-js';

const nhostClient = new OriginalNhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN || 'pmdddjhfyuqnpddamxhh',
  region: import.meta.env.VITE_NHOST_REGION || 'ap-south-1'
});

const nhost = {
  ...nhostClient,
  auth: {
    ...nhostClient.auth,
    signOut: async () => {
      await nhostClient.auth.signOut();
      return;
    },
    signIn: nhostClient.auth.signIn.bind(nhostClient.auth),
    signUp: nhostClient.auth.signUp.bind(nhostClient.auth),
    getSession: nhostClient.auth.getSession.bind(nhostClient.auth),
    url: nhostClient.auth.url
  }
};

export default nhost;