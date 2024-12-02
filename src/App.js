
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

function App() {


const [notification, setNotification] = useState(null);

const showNotification = (message, type) => {
  setNotification({ message, type });
  
  // Automatically hide notification after 3 seconds
  setTimeout(() => {
    setNotification(null);
  }, 3000);
};



useEffect(()=>{
 
},[])


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

    <Router>
      <Routes>
     
        {/* Login Page */}
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

       
      </Routes>
    </Router>
    </div>
  );
}

export default App;
