import { getToken } from "firebase/messaging";
import { messaging } from "../firebaseConfig";


const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BIOhawOi7hoAyghfuoTYSu4WZSBF6Ma7pQexFwSAExt5NpBxQw1sbgDDLmt_AyMj97xopYuwnZm6ICOiFl6_BQs", // Get this from Firebase Console > Cloud Messaging
      });

      if (token) {
        console.log("FCM Token:", token);
        // Send this token to your backend to send notifications
      } else {
        console.log("No registration token available. Request permission to generate one.");
      }
    } else {
      console.error("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
};

export default requestNotificationPermission;
