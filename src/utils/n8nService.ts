import type { NewsCategory } from '../types';

interface NewsPreferences {
  topic: NewsCategory;
  keywords: string[];
  preferred_sources: string[];
}

interface N8nResponse {
  success: boolean;
  message?: string;
  data?: any;
}

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/news-flow';
const N8N_REFRESH_WEBHOOK_URL = import.meta.env.VITE_N8N_REFRESH_WEBHOOK_URL || 'http://localhost:5678/webhook/refresh-news';

async function makeN8nRequest(url: string, payload: any): Promise<N8nResponse> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export const triggerNewsUpdate = async (
  userId: string, 
  preferences: NewsPreferences
): Promise<N8nResponse> => {
  return makeN8nRequest(N8N_WEBHOOK_URL, { userId, preferences });
};

export const refreshUserNews = async (
  userId: string
): Promise<N8nResponse> => {
  return makeN8nRequest(N8N_REFRESH_WEBHOOK_URL, { userId, action: 'refresh' });
};