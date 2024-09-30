import axios, { type AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: /*import.meta.env.VITE_API_URL ||*/ 'http://51.77.193.20:3024/',
  headers: {
    'Content-Type': 'application/json'
    // Add other headers as needed
  },
  timeout: 10000 // Set a timeout (optional)
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  // Modify the request config here
  const token = localStorage.getItem('token') ?? '';
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default apiClient;
