import axios from "axios";

// Base API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000, // Optional: Set a timeout for requests
});

// Add request interceptor to include Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Or sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response, // Pass successful responses directly
  (error) => {
    if (error.response?.status === 401) {
      // Handle expired token or unauthorized access
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error); // Let other handlers manage specific errors
  }
);

export default apiClient;
