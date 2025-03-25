import React, { useState } from 'react';
import { N8nWorkflowManager } from '../utils/n8nWorkflowManager';

const N8nTest: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing connection...');
    try {
      const workflowManager = new N8nWorkflowManager();
      const result = await workflowManager.verifyConnection();
      setStatus(`Connection successful! Workflow name: ${result.name}`);
      console.log('Workflow details:', result);
    } catch (error) {
      setStatus(`Connection failed: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white text-black">
      <h2 className="text-xl font-bold mb-4">N8n Workflow Test</h2>
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button 
            onClick={testConnection}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test Connection
          </button>
        </div>
        <div className="mt-4">
          <p className="font-semibold">Status:</p>
          <div className="p-3 bg-gray-100 rounded">
            {status || 'No action taken yet'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default N8nTest;