/**
 * Material-UI helper utilities
 * This file provides compatibility functions for Material-UI 
 * to help with migration between versions
 */

// Default fallback function if imports fail
const fallbackColorUtil = (color, opacity) => {
  // Simple opacity function for fallback
  if (color.startsWith('#')) {
    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  }
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  }
  return color;
};

// Initialize with fallback
let colorUtil = fallbackColorUtil;

// Dynamically import the correct utility
import('@material-ui/core/styles')
  .then(styles => {
    // Try alpha first (newer versions)
    if (styles.alpha) {
      colorUtil = styles.alpha;
    } 
    // Fall back to fade (older versions)
    else if (styles.fade) {
      colorUtil = styles.fade;
    }
  })
  .catch(() => {
    // Keep using fallback if import fails
    console.warn('Material-UI styles import failed, using fallback alpha function');
  });

/**
 * Color manipulation utility that works across Material-UI versions
 * @param {string} color - The color to manipulate
 * @param {number} opacity - The opacity to apply (0-1)
 * @returns {string} The color with opacity applied
 */
export const alpha = (color, opacity) => colorUtil(color, opacity);

// For backward compatibility
export const fade = (color, opacity) => colorUtil(color, opacity);

export default {
  alpha,
  fade
};
