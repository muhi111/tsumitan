import { auth } from '../firebase/config';

// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Get the current user's authentication token
 */
const getAuthToken = async (): Promise<string | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return null;
  }
  
  try {
    const token = await currentUser.getIdToken();
    return token;
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

/**
 * API request configuration interface
 */
interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Make an authenticated API request
 */
const apiRequest = async (
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<Response> => {
  const { method = 'GET', body, headers = {} } = options;
  
  // Get authentication token
  const token = await getAuthToken();
  
  // Prepare headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };
  
  // Add authentication header if token is available
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }
  
  // Prepare request configuration
  const requestConfig: RequestInit = {
    method,
    headers: requestHeaders,
  };
  
  // Add body for non-GET requests
  if (body && method !== 'GET') {
    requestConfig.body = JSON.stringify(body);
  }
  
  // Make the request
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, requestConfig);
  
  return response;
};

/**
 * Convenience method for GET requests
 */
export const apiGet = async (endpoint: string): Promise<Response> => {
  return apiRequest(endpoint, { method: 'GET' });
};

/**
 * Convenience method for POST requests
 */
export const apiPost = async (endpoint: string, body?: any): Promise<Response> => {
  return apiRequest(endpoint, { method: 'POST', body });
};

/**
 * Convenience method for PATCH requests
 */
export const apiPatch = async (endpoint: string, body?: any): Promise<Response> => {
  return apiRequest(endpoint, { method: 'PATCH', body });
};

/**
 * Convenience method for PUT requests
 */
const apiPut = async (endpoint: string, body?: any): Promise<Response> => {
  return apiRequest(endpoint, { method: 'PUT', body });
};

/**
 * Convenience method for DELETE requests
 */
const apiDelete = async (endpoint: string): Promise<Response> => {
  return apiRequest(endpoint, { method: 'DELETE' });
};
