import axios from "axios";
import { clearUserInfo } from "../store/userSlice";

// Base API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000, // Set a timeout for requests (optional)
});

// Helper function to retrieve token
const getToken = () => localStorage.getItem("token"); // Or use sessionStorage

// Function to initialize interceptors with dispatch
export const configureInterceptors = (dispatch) => {
  // Request interceptor to include Authorization header
  apiClient.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle errors globally
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle expired token or unauthorized access
        alert("Your session has expired. Please log in again.");
        dispatch(clearUserInfo()); // Clear user data in Redux store
        localStorage.removeItem("token"); // Optional: Clear token
        window.location.href = "/login"; // Redirect to login page
  
        // Suppress the error completely by returning a resolved promise
        return Promise.resolve({ data: [] }); // Optionally, return a fake response
      }
  
      // For other errors, propagate them as usual
      return Promise.reject(error);
    }
  );
};

export default apiClient;
