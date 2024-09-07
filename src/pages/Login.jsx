import React from 'react';
import { auth, provider, signInWithPopup } from '../utils/firebase_sdk';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const Login = () => {
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User Info:", result.user); // Log user info for debugging

      // After a successful login, navigate to the home page
      navigate('/home');
    } catch (error) {
      console.error("Google Sign-In Error:", error); // Log any errors
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center w-full mb-6"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
