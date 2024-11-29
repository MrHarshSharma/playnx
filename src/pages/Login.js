import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in: ", error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-white h-screen gap-10">
     <img src='images/playnx.png' className="h-3/6"/>
      <button
      onClick={handleLogin}
      className="flex items-center justify-center  text-black font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 w-full max-w-xs"
    >
      {/* Google Icon */}
      <span className="flex justify-center items-center gap-2">
      <FcGoogle />
      Sign in with Google
      </span>
    </button>
    </div>
  );
};

export default Login;
