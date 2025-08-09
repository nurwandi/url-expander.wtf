// AWS API configuration
const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'https://api.url-expander.wtf/v1';

export interface UrlMapping {
  id: string;
  original_url: string;
  expanded_code: string;
  created_at: string;
  expires_at: string;
}

export async function storeUrlMapping(data: UrlMapping): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/url-mappings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to store URL mapping');
    }
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