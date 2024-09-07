import React, { useEffect, useState } from 'react';
import { auth, db } from '../utils/firebase_sdk'; // Ensure Firestore is correctly imported
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'; // Import Firestore methods
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';

const HeroSection = () => {
  const [username, setUsername] = useState('');
  const [imageIds, setImageIds] = useState([]); // Store image IDs from Firestore
  const [loading, setLoading] = useState(true); // Loading state for fetching images

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        setUsername(user.displayName || 'User'); // Set username if user is available

        try {
          const userDocRef = doc(db, 'users', user.uid); // Reference to the Firestore document for the current user
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.imageIds) {
              setImageIds(userData.imageIds); // Store image IDs
            }
          }
        } catch (error) {
          console.error('Error fetching user images:', error);
        } finally {
          setLoading(false); // Stop loading when fetch is complete
        }
      } else {
        setLoading(false); // Stop loading if user is not authenticated
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col items-center w-screen bg-gray-100 p-8 sm:p-12 lg:p-16">
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Welcome, {username}!</h1>
        <p className="mt-4 text-gray-600">This is the hero section of the application.</p>

        {/* Image Upload Component */}
        <div className="mt-6">
          <ImageUpload
            onImageUploaded={(newImageId) => {
              setImageIds((prevImageIds) => [...prevImageIds, newImageId]);
            }}
          />
        </div>

        {/* Image Gallery Component */}
        <div className="mt-6">
          {loading ? (
            <p className="text-gray-500">Loading images...</p>
          ) : (
            <ImageGallery imageIds={imageIds} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
