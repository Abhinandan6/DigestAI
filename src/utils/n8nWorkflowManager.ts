import type { NewsCategory } from '../types';

interface WorkflowData {
  userId: string;
  preferences: {
    topic: NewsCategory;
    keywords: string[];
    preferred_sources: string[];
  };
}

interface N8nResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Utility to manage n8n workflows programmatically
 */
import newsUpdateWorkflow from '../n8n/workflows/newsUpdateWorkflow.json';

// Fix for the string | undefined type issue and the missing workflowId property

export class N8nWorkflowManager {
  private apiUrl: string;
  private apiKey: string;
  private webhookUrl: string;
  private refreshWebhookUrl: string;
  private workflowId?: string; // Add workflowId property

  constructor(
    apiUrl?: string,
    apiKey?: string,
    webhookUrl?: string,
    refreshWebhookUrl?: string
  ) {
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
      'https://n8n-dev.subspace.money/webhook/news-flow';
    
    this.refreshWebhookUrl = refreshWebhookUrl || 
      (typeof process !== 'undefined' && process.env?.VITE_N8N_REFRESH_WEBHOOK_URL) || 
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_REFRESH_WEBHOOK_URL) || 
      'https://n8n-dev.subspace.money/webhook/refresh-news';
  }

  /**
   * Execute workflow directly via webhook
   */
  async executeWorkflow(data: Partial<WorkflowData>): Promise<N8nResponse> {
    try {
      // Ensure data has all required properties to prevent "machine" undefined error
      const safeData = {
        userId: data?.userId || 'anonymous',
        preferences: {
          topic: data?.preferences?.topic || 'general',
          keywords: Array.isArray(data?.preferences?.keywords) ? data.preferences.keywords : [],
          preferred_sources: Array.isArray(data?.preferences?.preferred_sources) ? data.preferences.preferred_sources : []
        },
        timestamp: new Date().toISOString()
      };

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
   * Get credentials
   */
  async getCredentials() {
    try {
      const response = await fetch(`${this.apiUrl}/credentials`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey,
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get credentials: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting credentials:', error);
      throw error;
    }
  }

  /**
   * Verify connection and get workflow details
   */
  async verifyConnection() {
    try {
      const response = await fetch(`${this.apiUrl}/workflows/${this.workflowId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey,
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to connect: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying connection:', error);
      throw error;
    }
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

  /**
   * Refresh news data for a user
   */
  async refreshNews(userId: string): Promise<N8nResponse> {
    try {
      const response = await fetch(this.refreshWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'refresh',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh news: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error refreshing news:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
  // Update the method that uses workflowId
  async triggerWorkflow(userId: string): Promise<any> {
    // Remove unused url declaration and define safeData
    const safeData = {
      userId,
      timestamp: new Date().toISOString()
    };

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
  }
}