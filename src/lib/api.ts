// API configuration for development and production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      register: `${API_BASE_URL}/api/auth/register`,
      login: `${API_BASE_URL}/api/auth/login`,
      verifyEmail: `${API_BASE_URL}/api/auth/verify-email`,
      forgotPassword: `${API_BASE_URL}/api/auth/forgot-password`,
      resetPassword: `${API_BASE_URL}/api/auth/reset-password`,
    },
    courses: `${API_BASE_URL}/api/courses`,
    users: `${API_BASE_URL}/api/users`,
    enrollments: `${API_BASE_URL}/api/enrollments`,
    payments: `${API_BASE_URL}/api/payments`,
    admin: `${API_BASE_URL}/api/admin`,
  }
};

// Helper function to make API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  return response.json();
}; 