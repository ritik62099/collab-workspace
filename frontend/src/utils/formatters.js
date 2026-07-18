export const formatters = {
  // Format date
  formatDate: (date, options = {}) => {
    if (!date) return '';
    const dateObj = new Date(date);
    const defaultOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
  },

  // Format time
  formatTime: (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  },

  // Format date and time
  formatDateTime: (date) => {
    if (!date) return '';
    return `${formatters.formatDate(date)} at ${formatters.formatTime(date)}`;
  },

  // Format relative time (e.g., "2 hours ago")
  formatRelativeTime: (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return formatters.formatDate(date);
  },

  // Format number with commas
  formatNumber: (num) => {
    if (num === null || num === undefined) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  // Truncate text
  truncate: (text, length = 50) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  },

  // Capitalize first letter
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};