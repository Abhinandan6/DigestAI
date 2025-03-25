import React, { useEffect, useState } from 'react';
import { N8nWorkflowManager } from '../utils/n8nWorkflowManager';

const WorkflowManager: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [workflowId, setWorkflowId] = useState('');

  useEffect(() => {
    // Initialize on component mount
    const apiUrl = import.meta.env.VITE_N8N_API_URL;
    const apiKey = import.meta.env.VITE_N8N_API_KEY;
    
    if (!apiUrl || !apiKey) {
      setStatus('error');
      setMessage('Missing N8N API configuration. Please check your environment variables.');
      return;
    }
  }, []);

  const handleDeploy = async () => {
    try {
      setStatus('loading');
      setMessage('Deploying workflow...');
      
      const apiUrl = import.meta.env.VITE_N8N_API_URL;
      const apiKey = import.meta.env.VITE_N8N_API_KEY;
      
      const manager = new N8nWorkflowManager(apiUrl, apiKey);
      const result = await manager.deployWorkflow();
      
      setWorkflowId(result.id);
      setStatus('success');
      setMessage(`Workflow deployed successfully with ID: ${result.id}`);
    } catch (error) {
      setStatus('error');
      setMessage(`Failed to deploy workflow: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleActivate = async () => {
    if (!workflowId) {
      setStatus('error');
      setMessage('No workflow ID available. Please deploy a workflow first.');
      return;
    }
    
    try {
      setStatus('loading');
      setMessage(`Activating workflow ${workflowId}...`);
      
      const apiUrl = import.meta.env.VITE_N8N_API_URL;
      const apiKey = import.meta.env.VITE_N8N_API_KEY;
      
      const manager = new N8nWorkflowManager(apiUrl, apiKey);
      await manager.activateWorkflow(workflowId);
      
      setStatus('success');
      setMessage(`Workflow ${workflowId} activated successfully`);
    } catch (error) {
      setStatus('error');
      setMessage(`Failed to activate workflow: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="p-4 bg-navy-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">N8N Workflow Manager</h2>
      
      {status === 'loading' && (
        <div className="flex items-center mb-4">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
          <p>{message}</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      
      {status === 'error' && (
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      
      <div className="flex space-x-4">
        <button
          onClick={handleDeploy}
          disabled={status === 'loading'}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed"
        >
          Deploy Workflow
        </button>
        
        <button
          onClick={handleActivate}
          disabled={status === 'loading' || !workflowId}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed"
        >
          Activate Workflow
        </button>
      </div>
    </div>
  );
};

export default WorkflowManager;