import React, { useState } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
import Modal from './Modal'; // Import the Modal component

const ImageGallery = ({ imageIds }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const cld = new Cloudinary({ cloud: { cloudName: 'dh9bdtauy' } });

  const images = imageIds.map((imageId) =>
    cld.image(imageId)
      .format('auto')
      .quality('auto')
      .resize(auto().gravity(autoGravity()).width(500).height(500))
  );

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage('');
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold">Uploaded Images:</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {images.length > 0 ? (
          images.map((img, index) => (
            <div
              key={index}
              className="w-full h-auto cursor-pointer"
              onClick={() => handleImageClick(img.toURL())} // Click handler to open modal
            >
              <AdvancedImage cldImg={img} className="w-full h-auto" />
            </div>
          ))
        ) : (
          <p>No images found.</p>
        )}
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        imageSrc={selectedImage}
      />
    </div>
  );
};

export default ImageGallery;
