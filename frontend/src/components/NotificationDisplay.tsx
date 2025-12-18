import React from "react";
import { useNotifications } from "../context/NotificationContext";

const NotificationDisplay = () => {
  const { notifications, clearNotifications } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={clearNotifications}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {notifications.map((notification, index) => (
            <div key={index} className="text-sm text-gray-600">
              {notification}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationDisplay;
