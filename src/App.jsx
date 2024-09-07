import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import { auth } from './utils/firebase_sdk'; // Import Firebase auth

function App() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false); // Stop loading after auth state is determined
      if (user) {
        navigate('/home');
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Render a loading state while checking auth
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
