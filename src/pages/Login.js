import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

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
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
