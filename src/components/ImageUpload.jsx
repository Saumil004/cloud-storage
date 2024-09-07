import React, { useState } from 'react';
import axios from 'axios';
import { auth, db } from '../utils/firebase_sdk'; // Ensure Firestore is correctly imported
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'; // Import Firestore methods

const ImageUpload = ({ onImageUploaded }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for image upload
  const [error, setError] = useState(null); // State to manage errors

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setError(null); // Clear any previous error
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleImageUpload = async () => {
    if (!image) {
      setError('Please select an image first.');
      return;
    }

    setLoading(true); // Start loading when upload begins
    setError(null); // Clear any previous error

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'cloud-test1'); // Replace with your Cloudinary upload preset

    try {
      // Upload image to Cloudinary
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dh9bdtauy/image/upload', // Replace `your_cloud_name`
        formData
      );
      
      const imageUrl = res.data.secure_url;
      const imageId = res.data.public_id; // Cloudinary public ID of the image

      console.log(imageUrl);

      // Store image public_id in Firestore associated with the user
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid); // Reference to the Firestore document for the current user
        
        // Check if the document exists
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) {
          // If document does not exist, create it with an empty array for imageIds
          await setDoc(userDocRef, {
            imageIds: []
          });
        }

        // Update Firestore with the image public ID
        await updateDoc(userDocRef, {
          imageIds: arrayUnion(imageId) // Add the new image ID to the existing array
        });
        
        // Notify parent component of the new image ID
        onImageUploaded(imageId);
      } else {
        setError('User is not authenticated.');
      }
    } catch (err) {
      console.error('Error uploading image or saving to Firestore:', err);
      setError('An error occurred while uploading the image. Please try again.');
    } finally {
      setLoading(false); // Stop loading after upload is complete
    }
  };

  return (
    <div className="mt-6">
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="mb-4"
      />
      <button
        onClick={handleImageUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        disabled={loading} // Disable button while uploading
      >
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>} {/* Display error messages */}
    </div>
  );
};

export default ImageUpload;
