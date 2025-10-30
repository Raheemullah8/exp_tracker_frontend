import axios from 'axios';

// Base URL for the backend API. Set VITE_API_URL in the frontend env (e.g. .env) to point to your server
// Example: VITE_API_URL=http://localhost:5000
const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE + '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: request/response interceptors can be added here
export default api;
