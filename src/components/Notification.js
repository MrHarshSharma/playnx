import React, { useEffect } from "react";

const Notifications = () => {
  // Request permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleNotificationClick = () => {
    showNotification("Hello!", {
      body: "This is a notification from your React app!",
      icon: "https://via.placeholder.com/150", // Optional: Replace with your image URL
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={handleNotificationClick}
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Show Notification
      </button>
    </div>
  );
};

// Request notification permission
const requestNotificationPermission = () => {
  if (!("Notification" in window)) {
    console.error("This browser does not support notifications.");
    return;
  }

  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
    } else if (permission === "denied") {
      console.error("Notification permission denied.");
    }
  });
};

// Show notification
const showNotification = (title, options) => {
  if (!("Notification" in window)) {
    console.error("This browser does not support notifications.");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, options);
  } else {
    console.error("Notifications are not allowed.");
  }
};

export default Notifications;
