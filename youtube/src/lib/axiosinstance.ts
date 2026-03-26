import axios from "axios";

const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (isLocalHost ? "http://127.0.0.1:5000" : "");

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: backendBaseUrl || undefined,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
}) as any;

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: any) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error:", error.message);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
