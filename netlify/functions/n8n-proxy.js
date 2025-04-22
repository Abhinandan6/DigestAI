const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Handle OPTIONS requests for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No content needed for preflight response
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Max-Age': '86400'
      }
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    };
  }

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    const { workflowId, data } = requestBody;

    if (!workflowId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Workflow ID is required' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      };
    }

    // Construct the n8n workflow execution URL
    const n8nUrl = process.env.VITE_N8N_API_URL || 'http://localhost:5678';
    const workflowUrl = `${n8nUrl}/api/v1/workflows/${workflowId}/execute`;

    console.log(`Proxying request to: ${workflowUrl}`);
    
    // Forward the request to n8n
    const n8nResponse = await fetch(workflowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add API key if available
        ...(process.env.VITE_N8N_API_KEY && {
          'X-N8N-API-KEY': process.env.VITE_N8N_API_KEY
        })
      },
      body: JSON.stringify(data)
    });

    // Get the response from n8n
    const responseData = await n8nResponse.json();

    // Return the response to the client
    return {
      statusCode: n8nResponse.status,
      body: JSON.stringify(responseData),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    console.error('Error proxying request to n8n:', error);
    
    // Return a fallback response with mock data if the real API fails
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Using fallback data due to API error',
        data: {
          articles: generateFallbackArticles(event.body ? JSON.parse(event.body).data?.preferences?.topic : 'general')
        }
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    };
  }
};

// Helper function to generate fallback articles
function generateFallbackArticles(topic = 'general') {
  const topics = {
    'technology': [
      {
        id: 'tech-1',
        title: 'Latest Advancements in AI Technology',
        summary: 'Researchers have made significant breakthroughs in AI development, with new models showing unprecedented language understanding capabilities.',
        sentiment: 'positive',
        source: 'Tech Insider',
        url: 'https://www.businessinsider.com/tech',
        publishedAt: new Date().toISOString()
      },
      // More tech articles...
    ],
    // More topics...
  };
  
  return topics[topic] || topics['general'] || [];
}