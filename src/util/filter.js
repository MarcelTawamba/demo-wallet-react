// Basic filter utilities

/**
 * Filters an array of objects based on a condition
 * @param {Array} array - The array to filter
 * @param {Object} condition - The condition object with key-value pairs
 * @returns {Array} - The filtered array
 */
export function filterByCondition(array, condition) {
  if (!array || !condition) return array;
  
  return array.filter(item => {
    for (const key in condition) {
      if (item[key] !== condition[key]) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Filters an array of objects based on a search term
 * @param {Array} array - The array to filter
 * @param {String} searchTerm - The search term
 * @param {Array} fields - The fields to search in
 * @returns {Array} - The filtered array
 */
export function filterBySearch(array, searchTerm, fields) {
  if (!array || !searchTerm || !fields) return array;
  
  const term = searchTerm.toLowerCase();
  return array.filter(item => {
    return fields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(term);
      }
      return false;
    });
  });
}

export default {
  filterByCondition,
  filterBySearch
}; 