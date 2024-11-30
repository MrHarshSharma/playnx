
  

  importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js");
  importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging.js");
  

  // Your Firebase configuration
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
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
