import React, { useEffect, useState } from 'react';
import { N8nWorkflowManager } from '../utils/n8nWorkflowManager';

const WorkflowManager = () => {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [workflowId, setWorkflowId] = useState('');

  useEffect(() => {
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
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">N8N Workflow Manager</h2>
      
      {status === 'loading' && (
        <div className="bg-blue-100 p-4 rounded mb-4">
          {message}
        </div>
      )}
      
      {status === 'success' && (
        <div className="bg-green-100 p-4 rounded mb-4">
          {message}
        </div>
      )}
      
      {status === 'error' && (
        <div className="bg-red-100 p-4 rounded mb-4">
          {message}
        </div>
      )}
      
      <div className="flex gap-4">
        <button
          onClick={handleDeploy}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Deploy Workflow
        </button>
        
        <button
          onClick={handleActivate}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={!workflowId}
        >
          Activate Workflow
        </button>
      </div>
    </div>
  );
};

export default WorkflowManager;