import React, { useState } from 'react';
import { Save, RotateCcw, Globe, Bell, Monitor, Database } from 'lucide-react';
import { Button } from '../components/ui/button';
import { FormInput } from '../components/ui/form-input';
import { Select } from '../components/ui/select';
import { cn } from '../lib/utils';
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
          <Button variant="outline" onClick={resetSettings}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('api')}
            className={cn(
              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center",
              activeTab === 'api'
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <Database className="h-4 w-4 mr-2" />
            API Settings
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={cn(
              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center",
              activeTab === 'preferences'
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <Monitor className="h-4 w-4 mr-2" />
            Preferences
          </button>
        </nav>
      </div>

      {/* API Settings Form */}
      {activeTab === 'api' && (
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgb(0,0,0,0.04)] p-6">
          <form onSubmit={handleApiSubmit} className="space-y-6">
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
              <Button type="submit" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* User Preferences Form */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgb(0,0,0,0.04)] p-6">
          <form onSubmit={handlePreferencesSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Select
                label="Theme"
                name="theme"
                defaultValue={settings.user.theme}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </Select>

              <Select
                label="Language"
                name="language"
                defaultValue={settings.user.language}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </Select>

              <Select
                label="Display Density"
                name="displayDensity"
                defaultValue={settings.user.displayDensity}
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </Select>

              <Select
                label="Timezone"
                name="timezone"
                defaultValue={settings.user.timezone}
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      defaultChecked={settings.user.notifications.email}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
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
                  <div className="flex h-5 items-center">
                    <input
                      id="pushNotifications"
                      name="pushNotifications"
                      type="checkbox"
                      defaultChecked={settings.user.notifications.push}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
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
                  <div className="flex h-5 items-center">
                    <input
                      id="desktopNotifications"
                      name="desktopNotifications"
                      type="checkbox"
                      defaultChecked={settings.user.notifications.desktop}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
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
              <Button type="submit" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="text-sm text-gray-500">
        Last updated: {new Date(settings.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}; 