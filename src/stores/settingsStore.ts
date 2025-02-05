import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, ApiSettings, UserSettings } from '../types/models';

const defaultSettings: Settings = {
  api: {
    baseUrl: 'https://api.example.com',
    timeout: 5000,
    retryAttempts: 3,
  },
  user: {
    theme: 'system',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      desktop: true,
    },
    displayDensity: 'comfortable',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  lastUpdated: new Date().toISOString(),
};

interface SettingsStore {
  settings: Settings;
  updateApiSettings: (api: Partial<ApiSettings>) => void;
  updateUserSettings: (user: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateApiSettings: (api) =>
        set((state) => ({
          settings: {
            ...state.settings,
            api: { ...state.settings.api, ...api },
            lastUpdated: new Date().toISOString(),
          },
        })),
      updateUserSettings: (user) =>
        set((state) => ({
          settings: {
            ...state.settings,
            user: { ...state.settings.user, ...user },
            lastUpdated: new Date().toISOString(),
          },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'settings-storage',
    }
  )
); 