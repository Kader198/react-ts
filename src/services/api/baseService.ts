import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { ApiSettings } from '../../types/models';

export class BaseService {
  protected baseUrl: string;
  protected timeout: number;
  protected retryAttempts: number;
  protected currentRetry: number = 0;

  constructor() {
    const { settings } = useSettingsStore.getState();
    this.baseUrl = settings.api.baseUrl;
    this.timeout = settings.api.timeout;
    this.retryAttempts = settings.api.retryAttempts;
  }

  updateConfig(settings: Partial<ApiSettings>) {
    if (settings.baseUrl) this.baseUrl = settings.baseUrl;
    if (settings.timeout) this.timeout = settings.timeout;
    if (settings.retryAttempts) this.retryAttempts = settings.retryAttempts;
  }

  protected async fetchWithRetry(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = useAuthStore.getState().token;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...options.headers,
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        if (response.status === 401) {
          useAuthStore.getState().logout();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (this.currentRetry < this.retryAttempts) {
        this.currentRetry++;
        await new Promise(resolve =>
          setTimeout(resolve, Math.pow(2, this.currentRetry) * 1000)
        );
        return this.fetchWithRetry(url, options);
      }
      throw error;
    }
  }

  protected handleError(error: unknown) {
    let message = 'An unexpected error occurred';

    if (error instanceof Error) {
      if ('status' in error) {
        switch ((error as any).status) {
          case 400: message = 'Invalid request. Please check your input.'; break;
          case 401: message = 'Session expired. Please login again.'; break;
          case 403: message = 'You do not have permission to perform this action.'; break;
          case 404: message = 'The requested resource was not found.'; break;
          case 429: message = 'Too many requests. Please try again later.'; break;
          case 500: message = 'Server error. Please try again later.'; break;
          default: message = error.message || 'An error occurred';
        }
      } else {
        message = error.message;
      }
    }

    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      icon: '❌',
      style: {
        background: '#FEE2E2',
        color: '#991B1B',
        border: '1px solid #F87171',
      },
    });

    console.error('[API Error]:', {
      message,
      error,
      timestamp: new Date().toISOString(),
    });

    throw error;
  }

  protected handleSuccess(message: string) {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      icon: '✅',
      style: {
        background: '#DCFCE7',
        color: '#166534',
        border: '1px solid #4ADE80',
      },
    });
  }
} 