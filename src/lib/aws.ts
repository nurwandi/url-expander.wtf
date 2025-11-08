// AWS API configuration
const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'https://api.url-expander.wtf/v1';

export interface UrlMapping {
  id: string;
  original_url: string;
  expanded_code: string;
  created_at: string;
  expires_at: string;
}

export async function storeUrlMapping(data: UrlMapping, accessToken?: string): Promise<void> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if token is provided
    if (accessToken) {
      headers['Authorization'] = accessToken;
      console.log('[DEBUG] Access token provided:', accessToken.substring(0, 20) + '...');
    } else {
      console.log('[DEBUG] No access token - anonymous request');
    }

    console.log('[DEBUG] Sending request to:', `${API_BASE_URL}/url-mappings`);
    console.log('[DEBUG] Request data:', data);

    const response = await fetch(`${API_BASE_URL}/url-mappings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    console.log('[DEBUG] Response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('[DEBUG] Error response:', error);
      throw new Error(error.error || 'Failed to store URL mapping');
    }

    const result = await response.json();
    console.log('[DEBUG] Success response:', result);
  } catch (error) {
    console.error('Error storing URL mapping:', error);
    throw error;
  }
}

export async function getUrlMapping(expandedCode: string): Promise<UrlMapping | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/url-mappings/${expandedCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to retrieve URL mapping');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error retrieving URL mapping:', error);
    return null;
  }
}