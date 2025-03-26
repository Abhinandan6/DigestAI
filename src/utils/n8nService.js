// Ensure the correct environment variables are used
const N8N_WEBHOOK_URL =
  import.meta.env.VITE_N8N_WEBHOOK_URL ||
  'https://n8n-dev.subspace.money/webhook/news-flow';

const N8N_REFRESH_WEBHOOK_URL =
  import.meta.env.VITE_N8N_REFRESH_WEBHOOK_URL ||
  'https://n8n-dev.subspace.money/webhook/refresh-news';

/**
 * Generic function to make requests to n8n webhooks
 */
async function makeN8nRequest(url, payload) {
  try {
    console.log(`🔹 Sending request to: ${url}`);
    console.log(`🔹 Payload:`, payload);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error from n8n: ${errorText}`);
      throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Response from n8n:`, data);

    return { success: true, data };
  } catch (error) {
    console.error('❌ makeN8nRequest Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Trigger the n8n workflow for fetching news updates based on user preferences
 */
export const triggerNewsUpdate = async (userId, preferences) => {
  return makeN8nRequest(N8N_WEBHOOK_URL, { userId, preferences });
};

/**
 * Refresh the user's news feed by triggering the refresh workflow in n8n
 */
export const refreshUserNews = async (userId) => {
  return makeN8nRequest(N8N_REFRESH_WEBHOOK_URL, { userId, action: 'refresh' });
};
