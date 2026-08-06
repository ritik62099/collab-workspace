export const errorHandler = {
  // Handle API errors
  handleApiError: (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error
      return error.response.data?.message || 'An error occurred';
    } else if (error.request) {
      // Request made but no response
      return 'Network error. Please check your connection.';
    } else {
      // Something else happened
      return error.message || 'An unexpected error occurred';
    }
  },

  // Handle authentication errors
  handleAuthError: (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      // Redirect to login will be handled by auth store
      return 'Session expired. Please login again.';
    }
    return errorHandler.handleApiError(error);
  },

  // Show error notification
  showError: (message) => {
    console.error('Error:', message);
    // Toast will be used via useToast hook in components
    // Fallback to console for now
  },

  // Show success notification
  showSuccess: (message) => {
    console.log('Success:', message);
    // Toast will be used via useToast hook in components
    // Fallback to console for now
  },
};