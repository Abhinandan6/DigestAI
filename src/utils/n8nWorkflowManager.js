
/**
 * Utility to manage n8n workflows programmatically
 */
import newsUpdateWorkflow from '../n8n/workflows/newsUpdateWorkflow.json';

export class N8nWorkflowManager {
  constructor(
    apiUrl,
    apiKey,
    webhookUrl,
    refreshWebhookUrl) {
    // Ensure default values are provided to avoid undefined
    this.apiUrl = apiUrl || 
      (typeof process !== 'undefined' && process.env?.VITE_N8N_API_URL) || 
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_API_URL) || 
      'https://n8n-dev.subspace.money';
    
    // Ensure apiKey is always a string
    this.apiKey = apiKey || 
      (typeof process !== 'undefined' && process.env?.VITE_N8N_API_KEY) || 
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_API_KEY) || 
      '';
    
    this.webhookUrl = webhookUrl || 
      (typeof process !== 'undefined' && process.env?.VITE_N8N_WEBHOOK_URL) || 
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_WEBHOOK_URL) || 
      'https://n8n-dev.subspace.money/webhook-test/news-flow';
    
    this.refreshWebhookUrl = refreshWebhookUrl || 
      (typeof process !== 'undefined' && process.env?.VITE_N8N_REFRESH_WEBHOOK_URL) || 
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_REFRESH_WEBHOOK_URL) || 
      'https://n8n-dev.subspace.money/webhook-test/refresh-news';
    
    this.workflowId = null;
  }

  /**
   * Execute workflow directly via webhook
   */
  async executeWorkflow(data) {
    try {
      // Ensure data has all required properties to prevent "machine" undefined error
      const safeData = {
        userId: data?.userId || 'anonymous',
        action: data?.action || 'fetch',
        preferences: {
          topic: data?.preferences?.topic || 'general',
          keywords: Array.isArray(data?.preferences?.keywords) ? data.preferences.keywords : [],
          preferred_sources: Array.isArray(data?.preferences?.preferred_sources) ? data.preferences.preferred_sources : []
        },
        timestamp: new Date().toISOString()
      };

      console.log('Executing workflow with data:', safeData);

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(safeData)
      });

      if (!response.ok) {
        throw new Error(`Failed to execute workflow: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error executing workflow:', error);
      throw error;
    }
  }

  /**
   * Refresh news data
   */
  async refreshNews() {
    try {
      const response = await fetch(this.refreshWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'refresh',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh news: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error refreshing news:', error);
      throw error;
    }
  }
}

export default N8nWorkflowManager;