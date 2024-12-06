import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { app, auth, db } from "../firebaseConfig";
import { useAtom } from "jotai";
import { logedUser } from "../store";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { fetchMyData } from "../constants/genericFunctions";
import Spinner from "../components/Spinner";



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
      friendList:[],
      friendReq:[],
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

  async function registerUser(){
    let checkCurrentUser = await fetchMyData(user.uid)
    if(checkCurrentUser.length==0){
      saveUserToFirestore(user)
    }
  }

  if(user){
    setLogUser(user)
    console.log(user)
    registerUser()
  }


},[user])

if (loading) {
  return <Spinner/>;
}

if (!user) {
  console.log("User is not authenticated. Redirecting to login.");
  return <Navigate to="/" />;
}


return children;
}

export default ProtectedRoute;
