// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
firebase.initializeApp({
  apiKey: "AIzaSyBHbqh-i8B1X7cwiGrHjC2KoUku0zP2U3s",
  authDomain: "pushnotificationtester-43e97.firebaseapp.com",
  projectId: "pushnotificationtester-43e97",
  storageBucket: "pushnotificationtester-43e97.firebasestorage.app",
  messagingSenderId: "1027173446354",
  appId: "1:1027173446354:web:b78f1e153ba04a53d5f30b",
  measurementId: "G-H6THH8V6Z2"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
