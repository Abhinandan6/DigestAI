/**
 * Utility to handle CORS issues with multiple fallback strategies
 */

// Main function to make CORS-safe requests
async function corsRequest(url, options = {}) {
  // Try multiple approaches
  let response = null;
  let error = null;

  // Approach 1: Direct fetch
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Origin': window.location.origin
      }
    });
    
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Direct fetch approach failed:', err);
    error = err;
  }

  // Approach 2: Use Netlify function if it's an n8n URL
  if (url.includes('n8n-dev.subspace.money')) {
    try {
      const endpoint = url.includes('news-flow') ? 'news-flow' : 'refresh-news';
      response = await fetch(`/.netlify/functions/n8n-proxy/${endpoint}`, {
        method: options.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Netlify function approach failed:', err);
      error = err;
    }
  }

  // Approach 3: Try with no-cors mode (will result in opaque response)
  try {
    await fetch(url, {
      ...options,
      mode: 'no-cors'
    });
    
    // Return a generic success response since we can't read opaque responses
    return {
      success: true,
      message: 'Request sent in no-cors mode',
      opaque: true
    };
  } catch (err) {
    console.warn('No-cors approach failed:', err);
    error = err;
  }

  // All approaches failed
  throw new Error(`All CORS bypass approaches failed: ${error?.message || 'Unknown error'}`);
}

export { corsRequest };