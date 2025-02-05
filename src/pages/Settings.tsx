import React, { useState } from 'react';
import { Save, RotateCcw, Globe, Bell, Monitor, Database } from 'lucide-react';
import { FormInput } from '../components/ui/form-input';
import { useSettingsStore } from '../stores/settingsStore';
import { ApiSettings, UserSettings } from '../types/models';

const timezones = Intl.supportedValuesOf('timeZone');

export const Settings: React.FC = () => {
  const { settings, updateApiSettings, updateUserSettings, resetSettings } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<'api' | 'preferences'>('api');
  const [isSaving, setIsSaving] = useState(false);

  const handleApiSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const apiSettings: Partial<ApiSettings> = {
      baseUrl: formData.get('baseUrl') as string,
      apiKey: formData.get('apiKey') as string,
      timeout: Number(formData.get('timeout')),
      retryAttempts: Number(formData.get('retryAttempts')),
    };

    try {
      updateApiSettings(apiSettings);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreferencesSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const userSettings: Partial<UserSettings> = {
      theme: formData.get('theme') as UserSettings['theme'],
      language: formData.get('language') as UserSettings['language'],
      notifications: {
        email: formData.get('emailNotifications') === 'on',
        push: formData.get('pushNotifications') === 'on',
        desktop: formData.get('desktopNotifications') === 'on',
      },
      displayDensity: formData.get('displayDensity') as UserSettings['displayDensity'],
      timezone: formData.get('timezone') as string,
    };

    try {
      updateUserSettings(userSettings);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your application settings and preferences
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('api')}
            className={`${
              activeTab === 'api'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Database className="h-5 w-5 mr-2" />
            API Settings
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`${
              activeTab === 'preferences'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Monitor className="h-5 w-5 mr-2" />
            Preferences
          </button>
        </nav>
      </div>

      {/* API Settings Form */}
      {activeTab === 'api' && (
        <form onSubmit={handleApiSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormInput
              id="baseUrl"
              name="baseUrl"
              label="API Base URL"
              defaultValue={settings.api.baseUrl}
              icon={Globe}
              required
            />
            <FormInput
              id="apiKey"
              name="apiKey"
              label="API Key"
              type="password"
              defaultValue={settings.api.apiKey}
              helperText="Leave empty to use default key"
            />
            <FormInput
              id="timeout"
              name="timeout"
              label="Timeout (ms)"
              type="number"
              defaultValue={settings.api.timeout}
              required
            />
            <FormInput
              id="retryAttempts"
              name="retryAttempts"
              label="Retry Attempts"
              type="number"
              defaultValue={settings.api.retryAttempts}
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* User Preferences Form */}
      {activeTab === 'preferences' && (
        <form onSubmit={handlePreferencesSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Theme</label>
              <select
                name="theme"
                defaultValue={settings.user.theme}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <select
                name="language"
                defaultValue={settings.user.language}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Display Density</label>
              <select
                name="displayDensity"
                defaultValue={settings.user.displayDensity}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Timezone</label>
              <select
                name="timezone"
                defaultValue={settings.user.timezone}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="emailNotifications"
                    name="emailNotifications"
                    type="checkbox"
                    defaultChecked={settings.user.notifications.email}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                    Email notifications
                  </label>
                  <p className="text-gray-500">Get notified when tasks are assigned to you</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="pushNotifications"
                    name="pushNotifications"
                    type="checkbox"
                    defaultChecked={settings.user.notifications.push}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="pushNotifications" className="font-medium text-gray-700">
                    Push notifications
                  </label>
                  <p className="text-gray-500">Receive push notifications on your mobile device</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="desktopNotifications"
                    name="desktopNotifications"
                    type="checkbox"
                    defaultChecked={settings.user.notifications.desktop}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="desktopNotifications" className="font-medium text-gray-700">
                    Desktop notifications
                  </label>
                  <p className="text-gray-500">Get desktop notifications for important updates</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      <div className="text-sm text-gray-500">
        Last updated: {new Date(settings.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}; 