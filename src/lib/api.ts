/**
 * API Helper with Authentication
 * 
 * This module provides a wrapper around fetch that automatically
 * attaches the Authorization header with the session token.
 * 
 * PRODUCTION NOTE: In a real application, you should:
 * 1. Use environment variables for API endpoints
 * 2. Implement proper error handling and retry logic
 * 3. Add request/response interceptors for token refresh
 * 4. Use a more robust HTTP client library like Axios
 */

interface ApiOptions extends RequestInit {
  skipAuth?: boolean; // Option to skip auth header for public endpoints
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Get the current session token from localStorage
   * In production, consider using a more secure storage method
   */
  private getSessionToken(): string | null {
    return localStorage.getItem('sessionToken');
  }

  /**
   * Enhanced fetch wrapper that adds authentication headers
   */
  async fetch(url: string, options: ApiOptions = {}): Promise<Response> {
    const { skipAuth = false, headers = {}, ...restOptions } = options;

    // Build headers
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Add auth header if token exists and not skipped
    if (!skipAuth) {
      const token = this.getSessionToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    // Make the request
    const fullUrl = this.baseUrl ? `${this.baseUrl}${url}` : url;
    
    try {
      const response = await fetch(fullUrl, {
        ...restOptions,
        headers: requestHeaders,
      });

      // Handle 401 Unauthorized
      if (response.status === 401 && !skipAuth) {
        // Clear invalid session
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('currentUserId');
        
        // Optionally trigger a global auth state update
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        // You might want to redirect to login or show a modal
        // For now, we'll just throw an error
        throw new Error('Session expired. Please sign in again.');
      }

      return response;
    } catch (error) {
      // Network errors or other issues
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Convenience methods for common HTTP verbs
   */
  async get(url: string, options?: ApiOptions) {
    return this.fetch(url, { ...options, method: 'GET' });
  }

  async post(url: string, data?: any, options?: ApiOptions) {
    return this.fetch(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(url: string, data?: any, options?: ApiOptions) {
    return this.fetch(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch(url: string, data?: any, options?: ApiOptions) {
    return this.fetch(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(url: string, options?: ApiOptions) {
    return this.fetch(url, { ...options, method: 'DELETE' });
  }
}

// Create and export a default instance
const apiClient = new ApiClient();

// Export both the class and the default instance
export { ApiClient, apiClient };

/**
 * Main API fetch function that automatically includes auth headers
 * 
 * @example
 * // Making an authenticated request
 * const response = await apiFetch('/api/campaigns');
 * const campaigns = await response.json();
 * 
 * @example
 * // Making a POST request with data
 * const response = await apiFetch('/api/campaigns', {
 *   method: 'POST',
 *   body: JSON.stringify({ title: 'New Campaign', goal: 1000 })
 * });
 * 
 * @example
 * // Skipping authentication for public endpoints
 * const response = await apiFetch('/api/public/stats', { skipAuth: true });
 */
export const apiFetch = (url: string, options?: ApiOptions) => {
  return apiClient.fetch(url, options);
};

// Export convenience methods
export const apiGet = apiClient.get.bind(apiClient);
export const apiPost = apiClient.post.bind(apiClient);
export const apiPut = apiClient.put.bind(apiClient);
export const apiPatch = apiClient.patch.bind(apiClient);
export const apiDelete = apiClient.delete.bind(apiClient);

// Export default
export default apiClient;