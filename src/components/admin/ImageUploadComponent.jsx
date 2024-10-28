import { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/shadcn/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/components/ui/dialog';
import { X, Upload, Edit, Save } from 'lucide-react';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob));
    }, 'image/jpeg');
  });
};

export default function Component() {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(4 / 3);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      original: URL.createObjectURL(file),
      cropped: null,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const saveCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        currentImage.original,
        croppedAreaPixels
      );
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.original === currentImage.original
            ? { ...img, cropped: croppedImage }
            : img
        )
      );
      setIsCropperOpen(false);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, currentImage]);

  const openCropper = (image) => {
    setCurrentImage(image);
    setIsCropperOpen(true);
  };

  return (
    <div className='p-4'>
      <div className='mb-4'>
        <Button onClick={() => fileInputRef.current.click()}>
          <Upload className='w-4 h-4 mr-2' />
          Upload Images
        </Button>
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          accept='image/*'
          multiple
          className='hidden'
        />
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {images.map((image, index) => (
          <div
            key={index}
            className='relative'>
            <img
              src={image.cropped || image.original}
              alt={`Uploaded ${index + 1}`}
              className='w-full h-40 object-cover rounded-lg'
            />
            <Button
              variant='outline'
              size='icon'
              className='absolute top-2 right-2'
              onClick={() => openCropper(image)}>
              <Edit className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>

      <Dialog
        open={isCropperOpen}
        onOpenChange={setIsCropperOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className='relative h-64 w-full'>
            {currentImage && (
              <Cropper
                image={currentImage.original}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <div className='flex justify-between mt-4'>
            <Button
              onClick={() => setIsCropperOpen(false)}
              variant='outline'>
              <X className='w-4 h-4 mr-2' />
              Close
            </Button>
            <select
              value={aspect}
              onChange={(e) => setAspect(parseFloat(e.target.value))}
              className='p-2 mx-1 rounded bg-gray-800 text-sm text-white'>
              <option value={1}>1:1 (Square)</option>
              <option value={4 / 3}>4:3 (Standard)</option>
              <option value={16 / 9}>16:9 (Widescreen)</option>
              <option value={3 / 2}>3:2</option>
            </select>
            <Button onClick={saveCroppedImage}>
              <Save className='w-4 h-4 mr-2' />
              Save Crop
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
