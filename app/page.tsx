"use client";

import { useState } from "react";
import { useFCMToken, useFCMNotification } from "./hooks/useFCM";

export default function Home() {
  const { token, notificationPermission } = useFCMToken();
  const { notification } = useFCMNotification();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendNotification = async () => {
    if (!token) {
      setMessage("No FCM token available. Please allow notifications.");
      return;
    }

    if (!title || !body) {
      setMessage("Please enter both title and body.");
      return;
    }

    setSending(true);
    setMessage("");

    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          title,
          body,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Notification sent successfully!");
        setTitle("");
        setBody("");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("Failed to send notification");
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <main className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Firebase Push Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test push notifications with Firebase Cloud Messaging
          </p>
        </div>

        {/* Notification Permission Status */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Notification Permission:
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                notificationPermission === "granted"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                  : notificationPermission === "denied"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
              }`}
            >
              {notificationPermission}
            </span>
          </div>
        </div>

        {/* FCM Token Display */}
        {token && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your FCM Token:
            </label>
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600 break-all text-xs font-mono text-gray-600 dark:text-gray-400">
              {token}
            </div>
          </div>
        )}

        {/* Send Notification Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notification Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notification Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter notification message"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            onClick={handleSendNotification}
            disabled={sending || !token}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Send Test Notification"}
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.includes("Error") || message.includes("Failed")
                ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
                : "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
            }`}
          >
            {message}
          </div>
        )}

        {/* Last Received Notification */}
        {notification && (
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Last Received Notification:
            </h3>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {notification.notification?.title}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {notification.notification?.body}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
