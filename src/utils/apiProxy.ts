/**
 * API Proxy utility to handle CORS issues with external APIs
 */

export async function proxyRequest(targetUrl: string, method: string, headers: Record<string, string>, body?: any) {
  try {
    const options: RequestInit = {
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