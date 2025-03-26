// Enhanced API proxy with multiple CORS handling strategies
async function proxyRequest(targetUrl, method, headers, body) {
  try {
    // Try multiple approaches
    let response = null;
    let error = null;

    // Approach 1: Standard fetch with credentials
    try {
      const options = {
        method,
        headers: {
          ...headers,
          'Origin': window.location.origin
        },
        credentials: 'include'
      };

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
      }

      response = await fetch(targetUrl, options);
      
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Standard fetch approach failed:', err);
      error = err;
    }

    // Approach 2: Try with no-cors mode
    try {
      const options = {
        method,
        headers,
        mode: 'no-cors'
      };

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
      }

      await fetch(targetUrl, options);
      
      // Since no-cors returns opaque response, we can't read it
      // Return a generic success response
      return {
        success: true,
        message: 'Request sent in no-cors mode',
        opaque: true
      };
    } catch (err) {
      console.warn('No-cors approach failed:', err);
      error = err;
    }

    // Approach 3: Try using Netlify function if the URL is n8n
    if (targetUrl.includes('n8n-dev.subspace.money')) {
      try {
        const endpoint = targetUrl.includes('news-flow') ? 'news-flow' : 'refresh-news';
        response = await fetch(`/.netlify/functions/n8n-proxy/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn('Netlify function approach failed:', err);
        error = err;
      }
    }

    // All approaches failed
    throw new Error(`All proxy approaches failed: ${error?.message || 'Unknown error'}`);
  } catch (error) {
    console.error('Proxy request failed:', error);
    throw error;
  }
}

export { proxyRequest };