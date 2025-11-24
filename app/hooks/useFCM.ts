"use client";

import { useState, useEffect } from "react";
import { getMessaging, getToken, onMessage, isSupported } from "@/firebase";

export const useFCMToken = () => {
  const [token, setToken] = useState<string>("");
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
          const supported = await isSupported();
          
          if (!supported) {
            console.log("Firebase Messaging is not supported in this browser");
            return;
          }

          // Register service worker first
          const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
          console.log("Service Worker registered:", registration);

          // Wait for service worker to be ready
          await navigator.serviceWorker.ready;

          const permission = await Notification.requestPermission();
          setNotificationPermission(permission);

          if (permission === "granted") {
            const messaging = getMessaging();
            const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

            if (!vapidKey || vapidKey.includes("xxxx")) {
              console.error("VAPID key is not configured. Please add a valid NEXT_PUBLIC_FIREBASE_VAPID_KEY to your .env file");
              return;
            }

            const currentToken = await getToken(messaging, {
              vapidKey: vapidKey,
              serviceWorkerRegistration: registration,
            });

            if (currentToken) {
              setToken(currentToken);
              console.log("FCM Token:", currentToken);
            } else {
              console.log("No registration token available.");
            }
          }
        }
      } catch (error) {
        console.error("An error occurred while retrieving token:", error);
      }
    };

    retrieveToken();
  }, []);

  return { token, notificationPermission };
};

export const useFCMNotification = () => {
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    const setupNotificationListener = async () => {
      try {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
          const supported = await isSupported();
          
          if (supported) {
            const messaging = getMessaging();

            // Handle foreground messages
            onMessage(messaging, (payload) => {
              console.log("Message received in foreground:", payload);
              setNotification(payload);
              
              // Display notification
              if (Notification.permission === "granted") {
                new Notification(payload.notification?.title || "New Message", {
                  body: payload.notification?.body || "",
                  icon: "/firebase-logo.png",
                });
              }
            });
          }
        }
      } catch (error) {
        console.error("Error setting up notification listener:", error);
      }
    };

    setupNotificationListener();
  }, []);

  return { notification };
};
