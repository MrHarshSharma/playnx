import React, { useEffect } from "react";

const Notifications = () => {
  // Request permission for notifications
  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.error("Notification permission denied.");
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error.message);
      }
    } else {
      console.error("Notifications are not supported in this browser.");
    }
  };

  // Show a notification
  const showNotification = (title, options) => {
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, options);
      } catch (error) {
        console.error("Error showing notification:", error.message);
      }
    } else {
      console.error("Notifications are not allowed or supported.");
    }
  };

  // UseEffect to request permissions on component mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Handler for showing a notification
  const handleNotificationClick = () => {
    showNotification("Hello, Mobile User!", {
      body: "This is a notification from your React app!",
      icon: "images/playnx.png", // Optional icon URL
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="mb-4 text-xl font-bold">React Notifications</h1>
      <button
        onClick={handleNotificationClick}
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Show Notification
      </button>
    </div>
  );
};

export default Notifications;
