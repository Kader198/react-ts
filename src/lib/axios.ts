import axios from 'axios';
import { useSettingsStore } from '../stores/settingsStore';

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
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 