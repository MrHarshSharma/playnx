import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { deviceToken } from "./store";
import { useSetAtom } from "jotai";

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
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);

export const generateToken = async () => {
    const permission = await Notification.requestPermission()
    console.log(permission)
    if (permission === "granted") {

        const token = await getToken(messaging, {
            vapidKey: "BIOhawOi7hoAyghfuoTYSu4WZSBF6Ma7pQexFwSAExt5NpBxQw1sbgDDLmt_AyMj97xopYuwnZm6ICOiFl6_BQs"
        })

        console.log(token)
        localStorage.setItem('dt', token)
    }
}

