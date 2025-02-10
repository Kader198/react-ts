import { Database, Globe, Monitor, RotateCcw, Save } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { FormInput } from '../components/ui/form-input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import i18n from '../config/i18n';
import { ThemeProviderContext } from '../config/theme-povider';
import { cn } from '../lib/utils';
import { useSettingsStore } from '../stores/settingsStore';
import { ApiSettings, UserSettings } from '../types/models';

const timezones = Intl.supportedValuesOf('timeZone');

export const Settings: React.FC = () => {
  const { settings, updateApiSettings, updateUserSettings, resetSettings } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<'api' | 'preferences'>('api');
  const [isSaving, setIsSaving] = useState(false);
  const { theme, setTheme } = useContext(ThemeProviderContext)
  const { t } = useTranslation();

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
    const newTheme = formData.get('theme') as UserSettings['theme'];
    
    const userSettings: Partial<UserSettings> = {
      theme: newTheme,
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
      setTheme(newTheme);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsSaving(false);
    }
  };

  // Update language when changed
  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    // Update HTML dir attribute for RTL support
    document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = value;
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('settings.title')}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('settings.description')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button variant="outline" onClick={resetSettings}>
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('settings.resetButton')}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('api')}
            className={cn(
              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center",
              activeTab === 'api'
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            <Database className="h-4 w-4 mr-2" />
            {t('settings.tabs.api')}
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={cn(
              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center",
              activeTab === 'preferences'
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            <Monitor className="h-4 w-4 mr-2" />
            Preferences
          </button>
        </nav>
      </div>

      {/* API Settings Form */}
      {activeTab === 'api' && (
        <div className="card p-6">
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
        <div className="card p-6">
          <form onSubmit={handlePreferencesSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('settings.form.theme.label')}
                </label>
                <Select 
                  name="theme" 
                  defaultValue={settings.user.theme}
                  onValueChange={(value) => {
                    setTheme(value as UserSettings['theme']);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('settings.form.theme.label')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="light">
                        {t('settings.form.theme.options.light')}
                      </SelectItem>
                      <SelectItem value="dark">
                        {t('settings.form.theme.options.dark')}
                      </SelectItem>
                      <SelectItem value="system">
                        {t('settings.form.theme.options.system')}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('settings.form.language.label')}
                </label>
                <Select 
                  name="language" 
                  defaultValue={settings.user.language}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('settings.form.language.label')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('settings.form.displayDensity.label')}
                </label>
                <Select name="displayDensity" defaultValue={settings.user.displayDensity}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('settings.form.displayDensity.label')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="comfortable">
                        {t('settings.form.displayDensity.options.comfortable')}
                      </SelectItem>
                      <SelectItem value="compact">
                        {t('settings.form.displayDensity.options.compact')}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('settings.form.timezone.label')}
                </label>
                <Select name="timezone" defaultValue={settings.user.timezone}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('settings.form.timezone.label')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">
                {t('settings.form.notifications.title')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      defaultChecked={settings.user.notifications.email}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="emailNotifications" className="font-medium text-foreground">
                      {t('settings.form.notifications.email.label')}
                    </label>
                    <p className="text-muted-foreground">
                      {t('settings.form.notifications.email.description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="pushNotifications"
                      name="pushNotifications"
                      type="checkbox"
                      defaultChecked={settings.user.notifications.push}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="pushNotifications" className="font-medium text-foreground">
                      {t('settings.form.notifications.push.label')}
                    </label>
                    <p className="text-muted-foreground">
                      {t('settings.form.notifications.push.description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="desktopNotifications"
                      name="desktopNotifications"
                      type="checkbox"
                      defaultChecked={settings.user.notifications.desktop}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="desktopNotifications" className="font-medium text-foreground">
                      {t('settings.form.notifications.desktop.label')}
                    </label>
                    <p className="text-muted-foreground">
                      {t('settings.form.notifications.desktop.description')}
                    </p>
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

      <div className="text-sm text-muted-foreground">
        {t('settings.lastUpdated', {
          date: new Date(settings.lastUpdated).toLocaleString()
        })}
      </div>
    </div>
  );
}; 