import React, { useEffect, useState } from 'react';
import { N8nWorkflowManager } from '../utils/n8nWorkflowManager';

const WorkflowManager: React.FC = () => {
  const [status, setStatus] = useState('idle');
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
    
      N8N Workflow Manager
      
      {status === 'loading' && (
        
          
          {message}
        
      )}
      
      {status === 'success' && (
        
          {message}
        
      )}
      
      {status === 'error' && (
        
          {message}
        
      )}
      
      
        
          Deploy Workflow
        
        
        
          Activate Workflow
        
      
    
  );
};

export default WorkflowManager;