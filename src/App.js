
import './App.css';
import Login from './pages/Login';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ProtectedRoute from './routes/ProtectedRoutes';

import { useEffect, useState } from 'react';

import { onMessage } from 'firebase/messaging';

import Notification from './components/Notification';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import Friends from './pages/Friends';
import { appRoutes } from './constants/appRoutes';
import { useAtom } from 'jotai';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { logedUser, userFriendList, userFriendRequests, userNewRequests } from './store';
import { useAtomDevtools } from "jotai-devtools";
import Spinner from './components/Spinner';

function App() {

const [logUser, setLogUser] = useAtom(logedUser)
const [notification, setNotification] = useState(null);
const [friendRequests, setFriendRequests] = useAtom(userFriendRequests);
const [newRequests, setNewRequests] = useAtom(userNewRequests); 
const [loading, setLoading] = useState(true);
useAtomDevtools(logedUser, "logedUser");
useAtomDevtools(userFriendList, "myfriends");

const showNotification = (message, type) => {
  setNotification({ message, type });
  
  // Automatically hide notification after 3 seconds
  setTimeout(() => {
    setNotification(null);
  }, 3000);
};
useEffect(() => {
  setTimeout(() => setLoading(false), 3000); 
  // Simulates data loading

},[]);

useEffect(() => {
  if (logUser) {
    const userDocRef = doc(db, "users", logUser.uid); // Reference to the logged-in user's document

    // Firestore listener for friendreq field
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        if (data.friendReq) {
          const currentRequests = data.friendReq;

          // Detect new friend requests
          const newRequestIds = currentRequests.filter(
            (req) => !friendRequests.some((existing) => existing.id === req.id)
          );

          if (newRequestIds.length > 0) {
            setNewRequests((prev) => [...prev, ...newRequestIds]);
          }

          setFriendRequests(currentRequests);

          console.log(newRequestIds, currentRequests, newRequests)

        } else {
          setFriendRequests([]); // No friend requests
          console.log("no req")
        }
      } else {
        console.log("User document does not exist.");
      }

      setLoading(false); // Stop loading
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  } else {
    console.log("No logged-in user.");
    setLoading(false);
  }
}, [logUser]); 



  return (
<div>
<ToastContainer />
{notification && (
  <Notification
    message={notification.message}
    type={notification.type}
    onClose={() => setNotification(null)}
  />
)}

{loading &&  (
  <div className='h-full w-full backdrop-blur-md absolute z-50'>
  <Spinner />
  </div>
) }


    <Router>
      <Routes>
     
        {/* Login Page */}
        <Route path={appRoutes.LOGIN}element={<Login />} />
        <Route
          path={appRoutes.DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
        path={appRoutes.FRIENDS}
        element={
          <ProtectedRoute>
            <Friends />
          </ProtectedRoute>
        }
      />
       
      </Routes>
    </Router>
    </div>
  );
}

export default App;
