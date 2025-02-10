importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'your-api-key',
  authDomain: 'your-auth-domain',
  projectId: 'your-project-id',
  storageBucket: 'your-storage-bucket',
  messagingSenderId: 'your-messaging-sender-id',
  appId: 'your-app-id'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { notification } = payload;
  if (notification) {
    const notificationTitle = notification.title;
    const notificationOptions = {
      body: notification.body,
      icon: '/logo192.png',
      badge: '/logo192.png',
      data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  }
}); 