import React from 'react';
import nhost from '../utils/nhost';

const Debug = () => {
  return (
    <div className="p-8 bg-gray-800 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify({
          nhostClient: nhost.auth.getSession(),
          env: {
            VITE_NHOST_SUBDOMAIN: import.meta.env.VITE_NHOST_SUBDOMAIN,
            VITE_NHOST_REGION: import.meta.env.VITE_NHOST_REGION,
          }
        }, null, 2)}
      </pre>
    </div>
  );
};

export default Debug;