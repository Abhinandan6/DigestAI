const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Get the target endpoint from the path parameter
    const path = event.path.replace('/.netlify/functions/n8n-proxy/', '');
    
    // Determine which n8n endpoint to call
    let n8nUrl;
    if (path === 'news-flow') {
      n8nUrl = 'https://n8n-dev.subspace.money/webhook-test/news-flow';
    } else if (path === 'refresh-news') {
      n8nUrl = 'https://n8n-dev.subspace.money/webhook-test/refresh-news';
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid endpoint' })
      };
    }

    // Forward the request to n8n
    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: event.body
    });

    // If n8n returns an error
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: `Error from n8n: ${response.statusText}`,
          status: response.status
        })
      };
    }

    // Return the response from n8n
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Proxy error:', error);
    
    // Return a fallback response if we can't get data from n8n
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Error proxying request to n8n',
        message: error.message,
        success: false,
        articles: [] // Return empty articles array as fallback
      })
    };
  }
};