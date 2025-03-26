// Ensure the correct environment variables are used
const N8N_API_URL =
  import.meta.env.VITE_N8N_API_URL ||
  'https://n8n-dev.subspace.money';

// Use the direct workflow execution URL instead of webhooks
const WORKFLOW_ID = 'DtIaPVohlfY06TR2';
const WORKFLOW_EXECUTION_URL = `${N8N_API_URL}/api/v1/workflows/${WORKFLOW_ID}/execute`;

/**
 * Generic function to make requests to n8n workflow execution
 */
async function executeWorkflow(payload) {
  try {
    console.log(`🔹 Executing workflow: ${WORKFLOW_ID}`);
    console.log(`🔹 Payload:`, payload);

    // Add a timestamp to help with debugging
    const requestPayload = {
      ...payload,
      timestamp: new Date().toISOString(),
      // For the current workflow structure, we need to simulate user preferences
      // until the workflow is updated to handle direct requests
      simulatedPreferences: {
        topic: payload.preferences?.topic || 'technology',
        keywords: payload.preferences?.keywords || [],
        preferred_sources: payload.preferences?.preferred_sources || []
      }
    };

    const response = await fetch(WORKFLOW_EXECUTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add API key if available
        ...(import.meta.env.VITE_N8N_API_KEY && {
          'X-N8N-API-KEY': import.meta.env.VITE_N8N_API_KEY
        })
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`N8N request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('🔹 N8N response:', data);
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('❌ Error executing N8N workflow:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Refresh news for a specific user
 */
export async function refreshUserNews(userId) {
  if (!userId) {
    return {
      success: false,
      message: 'User ID is required'
    };
  }

  return executeWorkflow({
    userId,
    action: 'refresh'
  });
}

/**
 * Get news for a specific user with preferences
 */
export async function getUserNews(userId, preferences) {
  if (!userId) {
    return {
      success: false,
      message: 'User ID is required'
    };
  }

  return executeWorkflow({
    userId,
    preferences,
    action: 'fetch'
  });
}
