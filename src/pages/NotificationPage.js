import React, { useEffect, useState } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "../firebaseConfig";


const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      setNotifications((prev) => [
        ...prev,
        { title: payload.notification.title, body: payload.notification.body },
      ]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>
            <h2>{notif.title}</h2>
            <p>{notif.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPage;
