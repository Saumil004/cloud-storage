import React, { useState } from 'react';
import { auth } from '../utils/firebase_sdk'; // Import Firebase auth

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage mobile menu visibility

  const handleLogout = () => {
    auth.signOut().then(() => {
      // Redirect to login page or handle post-logout logic here
      window.location.href = '/'; // Redirect to the login page
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div>
      <nav className="w-full flex items-center justify-between bg-blue-200 h-16 px-4 relative">
        {/* Left section: Logo */}
        <div className="flex items-center">
          <img src="src/assets/react.svg" alt="Logo" className="h-12 w-12" /> 
          <span className="ml-2 text-xl font-bold">CloudStorage</span>
        </div>

        {/* Mobile menu button */}
        <button
          className="block lg:hidden text-xl"
          onClick={toggleMenu}
        >
          <span className="material-icons">menu</span>
        </button>

        {/* Navigation links */}
        <div className={`lg:flex lg:space-x-6 ${isMenuOpen ? 'block' : 'hidden'} lg:block absolute lg:relative top-16 right-4 bg-blue-200 lg:bg-transparent lg:top-auto lg:right-auto p-4 lg:p-0`}>
          <a href="/home" className="block lg:inline text-lg hover:text-blue-500 mb-2 lg:mb-0">Home</a>
          <a href="/about" className="block lg:inline text-lg hover:text-blue-500 mb-2 lg:mb-0">About Us</a>
          <button 
            onClick={handleLogout} 
            className="block lg:inline text-lg hover:text-blue-500 bg-transparent border-none cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
