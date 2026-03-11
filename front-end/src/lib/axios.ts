import axios from "axios";
import { useAuthStore } from "../stores/authStore.js";

const axiosApi = axios.create({
  baseURL: "http://localhost:5000", 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach access token automatically
axiosApi.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosApi;