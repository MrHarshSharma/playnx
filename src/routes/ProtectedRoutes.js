import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { useAtom } from "jotai";
import { logedUser } from "../store";


const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
const [loguser, setLogUser] = useAtom(logedUser)
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    console.log("User is not authenticated. Redirecting to login.");
    return <Navigate to="/" />;
  }
if(user){
    setLogUser(user)

}

  return children;
};

export default ProtectedRoute;
