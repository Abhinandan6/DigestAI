import React, { useState } from 'react';
import nhost from '../utils/nhost';
import { refreshUserNews } from '../utils/n8nService';

const Debug = () => {
  const [workflowStatus, setWorkflowStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testWorkflowConnection = async () => {
    setIsLoading(true);
    try {
      const userId = nhost.auth.getUser()?.id || 'anonymous';
      const result = await refreshUserNews(userId);
      setWorkflowStatus(result);
    } catch (error) {
      setWorkflowStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-navy-800 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
        <pre className="bg-navy-900 p-4 rounded overflow-auto max-h-60">
          {JSON.stringify(nhost.auth.getSession(), null, 2)}
        </pre>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <pre className="bg-navy-900 p-4 rounded overflow-auto max-h-60">
          {JSON.stringify({
            VITE_NHOST_SUBDOMAIN: import.meta.env.VITE_NHOST_SUBDOMAIN,
            VITE_NHOST_REGION: import.meta.env.VITE_NHOST_REGION,
            VITE_N8N_API_URL: import.meta.env.VITE_N8N_API_URL,
            VITE_N8N_WEBHOOK_URL: import.meta.env.VITE_N8N_WEBHOOK_URL,
            VITE_N8N_REFRESH_WEBHOOK_URL: import.meta.env.VITE_N8N_REFRESH_WEBHOOK_URL,
          }, null, 2)}
        </pre>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">N8N Workflow Connection Test</h2>
        <button 
          onClick={testWorkflowConnection}
          disabled={isLoading}
          className="btn-primary mb-4"
        >
          {isLoading ? 'Testing...' : 'Test Workflow Connection'}
        </button>
        
        {workflowStatus && (
          <pre className={`p-4 rounded overflow-auto max-h-60 ${
            workflowStatus.success ? 'bg-pista-600/20' : 'bg-red-900/20'
          }`}>
            {JSON.stringify(workflowStatus, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default Debug;