import axios from 'axios';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';
const { settings } = useSettingsStore.getState();

export const axiosInstance = axios.create({
  baseURL: settings.api.baseUrl,
  timeout: settings.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
axiosInstance.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 