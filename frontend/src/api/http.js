import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  // If you were using cookie-based sanctum, you’d also need:
  // withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');  // <— our key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
