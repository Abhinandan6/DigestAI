/**
 * Service to interact with n8n webhooks for news automation
 */

interface NewsPreferences {
  topic: string;
  keywords: string[];
  preferred_sources: string[];
}

// Define environment variables
declare const VITE_N8N_WEBHOOK_URL: string;
declare const VITE_N8N_REFRESH_WEBHOOK_URL: string;

export const triggerNewsUpdate = async (userId: string, preferences: NewsPreferences) => {
  try {
    // The webhook URL should be stored in your environment variables
    const webhookUrl = typeof VITE_N8N_WEBHOOK_URL !== 'undefined' 
      ? VITE_N8N_WEBHOOK_URL 
      : 'https://your-n8n-instance.com/webhook/news-flow';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        preferences,
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error triggering n8n workflow: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to trigger n8n workflow:', error);
    throw error;
  }
};

/**
 * Manually trigger news refresh for a specific user
 */
export const refreshUserNews = async (userId: string) => {
  try {
    const webhookUrl = typeof VITE_N8N_REFRESH_WEBHOOK_URL !== 'undefined' 
      ? VITE_N8N_REFRESH_WEBHOOK_URL 
      : 'https://your-n8n-instance.com/webhook/refresh-news';
    
    const response = await fetch(webhookUrl, {
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
      throw new Error(`Error refreshing news: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to refresh news:', error);
    throw error;
  }
};