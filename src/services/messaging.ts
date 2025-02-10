import { toast } from 'react-hot-toast';
import { onMessageListener, requestNotificationPermission } from '../config/firebase';

class MessagingService {
  private token: string | null = null;

  async initialize() {
    try {
      const token = await requestNotificationPermission();
      if (token) {
        this.token = token;
        await this.registerTokenWithBackend(token);
        this.setupMessageListener();
      }
    } catch (error) {
      console.error('Error initializing messaging:', error);
    }
  }

  private setupMessageListener() {
    onMessageListener().then((payload: any) => {
      const { notification } = payload;
      if (notification) {
        toast.success(notification.title);
      }
    });
  }

  private async registerTokenWithBackend(token: string) {
    try {
      // Send token to your backend
      await fetch('/api/notifications/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
    } catch (error) {
      console.error('Error registering token with backend:', error);
    }
  }

  getToken() {
    return this.token;
  }
}

export const messagingService = new MessagingService(); 