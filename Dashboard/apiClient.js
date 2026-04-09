import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://192.168.1.74:8000/api";

const apiClient = axios.create({ baseURL: apiBaseUrl });

export const attachAuthInterceptor = (getAccessTokenSilently, loginWithRedirect) => {
  apiClient.interceptors.request.use(async (config) => {
    // Try to fetch token silently, fallback to login redirect if it fails
    const token = await getAccessTokenSilently({
      audience: apiBaseUrl,
    }).catch(() => {
      loginWithRedirect();
      return null; // stop request, user will be redirected
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  return apiClient;
};

export default apiClient;
