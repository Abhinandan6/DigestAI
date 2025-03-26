// Fix TypeScript syntax in apiProxy.js
async function proxyRequest(targetUrl, method, headers, body) {
  try {
    const options = {
      method,
      headers,
      mode: 'cors',
      credentials: 'include'
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(targetUrl, options);
    
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Proxy request failed:', error);
    throw error;
  }
}