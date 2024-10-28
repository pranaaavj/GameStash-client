/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

// Helper function to create an image element from a URL
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.crossOrigin = 'anonymous'; // To avoid CORS issues when loading the image
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
  });

export const ImageCropper = ({ imageUrl, onConfirm }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Function to get the cropped image
  const getCroppedImg = async () => {
    const image = await createImage(imageUrl);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const { width, height } = croppedAreaPixels;
    canvas.width = width;
    canvas.height = height;

    // Draw the cropped portion of the image onto the canvas
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      width,
      height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg');
    });
  };

  // Handle the Crop button click to preview the cropped image
  const handleCropClick = async () => {
    const croppedImage = await getCroppedImg();
    setCroppedImageUrl(croppedImage); // Show the cropped image preview
  };

  // Handle the Confirm button click to pass the cropped image back to the parent component
  const handleConfirm = () => {
    if (croppedImageUrl) {
      onConfirm(croppedImageUrl); // Send the final cropped image URL to the parent
    }
  };

  return (
    <div className='crop-container'>
      {croppedImageUrl ? (
        // Show the cropped image preview with Confirm and Re-crop options
        <div className='preview-container'>
          <img
            src={croppedImageUrl}
            alt='Cropped Preview'
            className='preview-image'
          />
          <button
            onClick={handleConfirm}
            className='confirm-button'>
            Confirm
          </button>
          <button
            onClick={() => setCroppedImageUrl(null)}
            className='recrop-button'>
            Re-crop
          </button>
        </div>
      ) : (
        // Show the cropping interface
        <>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <button
            onClick={handleCropClick}
            className='crop-button'>
            Crop Image
          </button>
        </>
      )}
    </div>
  );
};
