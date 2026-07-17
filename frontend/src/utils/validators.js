export const validators = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password validation
  isValidPassword: (password) => {
    return password && password.length >= 6;
  },

  // Name validation
  isValidName: (name) => {
    return name && name.trim().length >= 2 && name.trim().length <= 50;
  },

  // Required field validation
  isRequired: (value) => {
    return value && value.toString().trim().length > 0;
  },
};

// Form validation helpers
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const value = data[field];
    const fieldRules = rules[field];

    if (fieldRules.required && !validators.isRequired(value)) {
      errors[field] = `${field} is required`;
    } else if (fieldRules.email && value && !validators.isValidEmail(value)) {
      errors[field] = 'Invalid email address';
    } else if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
      errors[field] = `Minimum length is ${fieldRules.minLength}`;
    } else if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
      errors[field] = `Maximum length is ${fieldRules.maxLength}`;
    }
  });

  return errors;
};