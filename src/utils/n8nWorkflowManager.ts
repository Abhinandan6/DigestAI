/**
 * Utility to manage n8n workflows programmatically
 */
import newsUpdateWorkflow from '../n8n/workflows/newsUpdateWorkflow.json';

export class N8nWorkflowManager {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  /**
   * Deploy a workflow to n8n instance
   */
  async deployWorkflow(workflowData = newsUpdateWorkflow) {
    try {
      const response = await fetch(`${this.apiUrl}/workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey
        },
        body: JSON.stringify(workflowData)
      });

      if (!response.ok) {
        throw new Error(`Failed to deploy workflow: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deploying n8n workflow:', error);
      throw error;
    }
  }

  /**
   * Activate a workflow by ID
   */
  async activateWorkflow(workflowId: string) {
    try {
      const response = await fetch(`${this.apiUrl}/workflows/${workflowId}/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to activate workflow: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error activating n8n workflow:', error);
      throw error;
    }
  }
}