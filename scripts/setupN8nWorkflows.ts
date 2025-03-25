import { N8nWorkflowManager } from '../src/utils/n8nWorkflowManager.js';
import dotenv from 'dotenv';

dotenv.config();

async function setupWorkflows() {
  const n8nManager = new N8nWorkflowManager(
    process.env.N8N_API_URL || '',
    process.env.N8N_API_KEY || ''
  );

  try {
    console.log('Deploying news update workflow...');
    const workflow = await n8nManager.deployWorkflow();
    console.log(`Workflow deployed with ID: ${workflow.id}`);
    
    console.log('Activating workflow...');
    await n8nManager.activateWorkflow(workflow.id);
    console.log('Workflow activated successfully');
  } catch (error) {
    console.error('Failed to set up workflows:', error);
    process.exit(1);
  }
}

setupWorkflows();