// src/apiClient.js
import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "https://209.38.148.143/api/api";

const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

// Attach interceptor to include Auth0 token
export const attachAuthInterceptor = (getAccessTokenSilentlyFn) => {
  apiClient.interceptors.request.use(async (config) => {
    try {
      const token = await getAccessTokenSilentlyFn({
        audience: "https://209.38.148.143/api",
      });
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("⚠️ No token returned from Auth0");
      }
    } catch (err) {
      console.error("Auth0 token fetch failed:", err);
    }
    return config;
  });
};

export default apiClient;
