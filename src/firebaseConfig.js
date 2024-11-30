import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getMessaging, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDzfj-FvDIseA1J8MnMiNzNkOhE8P-3seI",
    authDomain: "playnx-eb90b.firebaseapp.com",
    projectId: "playnx-eb90b",
    storageBucket: "playnx-eb90b.firebasestorage.app",
    messagingSenderId: "1019372509465",
    appId: "1:1019372509465:web:2bc3a5c1c4460e62134d88",
    measurementId: "G-YGHMK7LG7K"
  };
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
const analytics = getAnalytics(app);
