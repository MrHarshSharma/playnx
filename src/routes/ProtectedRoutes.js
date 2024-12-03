import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { app, auth, db } from "../firebaseConfig";
import { useAtom } from "jotai";
import { logedUser } from "../store";
import { doc, getFirestore, setDoc } from "firebase/firestore";



const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
const [loguser, setLogUser] = useAtom(logedUser)

const saveUserToFirestore = async (user) => {
  try {
    const userDoc = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: new Date().toISOString(),
    };

    // Save the user under the "users" collection
    await setDoc(doc(db, "users", user.uid), userDoc, { merge: true });
    console.log("User successfully saved to Firestore!");
  } catch (error) {
    console.error("Error saving user to Firestore:", error.message);
  }
};

useEffect(()=>{

  if(user){
    setLogUser(user)
    console.log(user)
  
    saveUserToFirestore(user);
  }


},[user])

if (loading) {
  return <p>Loading...</p>;
}

if (!user) {
  console.log("User is not authenticated. Redirecting to login.");
  return <Navigate to="/" />;
}


return children;
}

export default ProtectedRoute;
