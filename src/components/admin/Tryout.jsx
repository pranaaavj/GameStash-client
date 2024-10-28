import { useState } from 'react';
import { ImageCropper } from './ImageUpload';

export const CustomImageCropper = () => {
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); // The URL of the image to crop

  const handleCropComplete = (croppedImage) => {
    setCroppedImageUrl(croppedImage); // URL of the cropped image
  };

  return (
    <div className='app'>
      <h1>Image Cropper</h1>
      <input
        type='file'
        accept='image/*'
        onChange={(e) => {
          if (e.target.files.length) {
            setImageUrl(URL.createObjectURL(e.target.files[0]));
          }
        }}
      />
      {imageUrl && (
        <ImageCropper
          imageUrl={imageUrl}
          onCropComplete={handleCropComplete}
        />
      )}
      {croppedImageUrl && (
        <div>
          <h2>Cropped Image:</h2>
          <img
            src={croppedImageUrl}
            alt='Cropped'
          />
        </div>
      )}
    </div>
  );
};
