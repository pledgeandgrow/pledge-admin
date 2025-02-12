// Utility functions for data management

/**
 * Generate a unique ID
 * @returns {string} Unique identifier
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether phone number is valid
 */
export const validatePhone = (phone) => {
  const re = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  return re.test(String(phone));
};

/**
 * Format date to a readable format
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

/**
 * Calculate years of experience
 * @param {string} startDate - Employment start date
 * @returns {number} Years of experience
 */
export const calculateExperience = (startDate) => {
  const start = new Date(startDate);
  const now = new Date();
  
  let years = now.getFullYear() - start.getFullYear();
  const monthDiff = now.getMonth() - start.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < start.getDate())) {
    years--;
  }
  
  return years;
};

/**
 * Perform fuzzy search on an array of objects
 * @param {Array} array - Array to search
 * @param {string} query - Search query
 * @param {Array} keys - Keys to search within
 * @returns {Array} Filtered results
 */
export const fuzzySearch = (array, query, keys) => {
  if (!query) return array;
  
  const lowercaseQuery = query.toLowerCase();
  
  return array.filter(item => 
    keys.some(key => 
      String(item[key])
        .toLowerCase()
        .includes(lowercaseQuery)
    )
  );
};

/**
 * Sort array of objects by a specific key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {boolean} ascending - Sort direction
 * @returns {Array} Sorted array
 */
export const sortBy = (array, key, ascending = true) => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return ascending ? -1 : 1;
    if (a[key] > b[key]) return ascending ? 1 : -1;
    return 0;
  });
};
