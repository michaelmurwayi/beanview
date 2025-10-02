// src/apiClient.js
import axios from "axios";
// import { getAccessTokenSilently } from "@auth0/auth0-react"; // via context hook later

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";


// Axios instance
const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

// Interceptor: inject token
export const attachAuthInterceptor = (getAccessTokenSilentlyFn) => {
  apiClient.interceptors.request.use(async (config) => {
    try {
      const token = await getAccessTokenSilentlyFn();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Auth0 token fetch failed:", err);
    }
    return config;
  });
};

export default apiClient;
