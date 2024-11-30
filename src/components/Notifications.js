import React, { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

const Notifications = () => {
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received in foreground: ", payload);
      // Show notification UI in your app (e.g., using toast)
      alert(`Notification: ${payload.notification.title} - ${payload.notification.body}`);
    });

    return () => unsubscribe();
  }, []);

  return <div>Notifications Component</div>;
};

export default Notifications;
