<<<<<<< HEAD
export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Collab Workspace',
  NODE_ENV: import.meta.env.MODE || 'development',
};

export default env;
=======
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  appName: 'CollabSpace',
  tokenKey: 'collab_token',
};
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
