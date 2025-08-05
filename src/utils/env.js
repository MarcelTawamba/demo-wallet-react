// Helper function to get environment variables
export const getEnvVar = (key, defaultValue = undefined) => {
  // In development, use Vite's import.meta.env
  if (import.meta.env.DEV) {    
    const value = import.meta.env[key];
    if (value === undefined && defaultValue === undefined) {
      console.warn(`Environment variable ${key} is not set in development`);
    }
    return value ?? defaultValue;
  }
  
  // In production, use the runtime config
  if (!window.env) {
    console.warn('Environment configuration not found. Make sure env-config.js is loaded.');
    return defaultValue;
  }
  
  const value = window.env[key];
  if (value === undefined && defaultValue === undefined) {
    console.warn(`Environment variable ${key} is not set in production`);
  }
  return value ?? defaultValue;
};