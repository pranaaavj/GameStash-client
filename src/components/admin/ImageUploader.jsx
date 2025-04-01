import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { Button } from '@/shadcn/components/ui/button';
import { Card } from '@/shadcn/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/components/ui/dialog';
import { Alert, AlertDescription } from '@/shadcn/components/ui/alert';
import { Loader2, Upload, Crop, Trash2, RefreshCw } from 'lucide-react';
import { Progress } from '@/shadcn/components/ui/progress';

const MAX_FILES = 8;
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const extractPublicId = (imageUrl) => {
  return imageUrl.split('/').pop().split('.')[0];
};

export const ImageUploader = ({
  initialImages = [],
  onImagesChange,
  uploadProductImage,
  deleteProductImage,
}) => {
  // Internal state with more metadata for UI purposes
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Cropping state
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Set initial images using useEffect
  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      // Convert simple URL array to internal format with metadata
      setImages(
        initialImages.map((url) => ({
          id: Math.random().toString(36).substring(7),
          url: url,
          file: null,
          uploaded: true,
        }))
      );
    }
  }, [initialImages]);

  // Update parent component with simplified array of URLs
  const updateParent = (updatedImages) => {
    // Extract just the URLs for the parent component
    const urls = updatedImages
      .filter((img) => img.uploaded) // Only include uploaded images
      .map((img) => img.url);

    onImagesChange(urls);
  };

  // Validate files
  const validateFiles = (files) => {
    const newErrors = [];

    // Check if adding these files would exceed the maximum
    if (images.length + files.length > MAX_FILES) {
      newErrors.push(`You can only upload a maximum of ${MAX_FILES} images.`);
      return { valid: false, errors: newErrors };
    }

    // Validate each file
    for (const file of files) {
      // Check file type
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        newErrors.push(
          `File "${file.name}" has an unsupported format. Only JPEG, PNG, and WEBP are allowed.`
        );
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        newErrors.push(`File "${file.name}" exceeds the 5MB size limit.`);
      }
    }

    return { valid: newErrors.length === 0, errors: newErrors };
  };

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles) => {
      const { valid, errors } = validateFiles(acceptedFiles);

      if (!valid) {
        setErrors(errors);
        return;
      }

      const newImages = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        url: URL.createObjectURL(file),
        uploaded: false,
      }));

      setImages((prev) => [...prev, ...newImages]);
      setErrors([]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
    maxSize: MAX_FILE_SIZE,
  });

  // Handle image removal
  const removeImage = async (id) => {
    const imageToRemove = images.find((img) => img.id === id);

    // If the image is already uploaded to Cloudinary, delete it
    if (imageToRemove && imageToRemove.uploaded) {
      try {
        // Extract public ID from the URL
        const publicId = extractPublicId(imageToRemove.url);
        const response = await deleteProductImage(publicId).unwrap();
        console.log(response);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
        setErrors(['Failed to delete image. Please try again.']);
        return;
      }
    }

    // Remove from state
    const updatedImages = images.filter((img) => img.id !== id);
    setImages(updatedImages);

    // Notify parent component
    updateParent(updatedImages);
  };

  // Open crop dialog for an image
  const openCropDialog = (index) => {
    setCurrentImageIndex(index);
    setCropDialogOpen(true);
  };

  // Handle crop complete
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Create a cropped image
  const createCroppedImage = async () => {
    try {
      const imageToEdit = images[currentImageIndex];
      const imageUrl = imageToEdit.url;

      // Load the image
      const image = await createImage(imageUrl);

      // Create canvas for cropping
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas dimensions to cropped size
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      // Draw the cropped image
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Convert canvas to blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/jpeg',
          0.95
        );
      });

      // Create a new file from the blob
      const croppedFile = new File(
        [blob],
        imageToEdit.file ? imageToEdit.file.name : 'cropped-image.jpg',
        {
          type: 'image/jpeg',
        }
      );

      // Update the image in the state
      const updatedImages = [...images];
      updatedImages[currentImageIndex] = {
        ...imageToEdit,
        file: croppedFile,
        url: URL.createObjectURL(blob),
        uploaded: false,
      };

      setImages(updatedImages);
      setCropDialogOpen(false);
    } catch (error) {
      console.error('Error creating cropped image:', error);
      setErrors([...errors, 'Failed to crop image. Please try again.']);
    }
  };

  // Helper function to create an image from URL
  const createImage = (url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
      image.crossOrigin = 'anonymous';
    });
  };

  // Upload all images to Cloudinary
  const uploadImages = async () => {
    setUploading(true);
    setUploadProgress(0);
    setErrors([]);

    try {
      // Filter out images that need to be uploaded
      const imagesToUpload = images.filter((img) => !img.uploaded);

      if (imagesToUpload.length === 0) {
        // All images are already uploaded
        updateParent(images);
        setUploading(false);
        return;
      }

      const uploadedImages = [];

      // Upload each image
      for (let i = 0; i < imagesToUpload.length; i++) {
        const img = imagesToUpload[i];

        // Create form data for upload
        const formData = new FormData();
        formData.append('image', img.file);

        // Call the RTK mutation
        const result = await uploadProductImage(formData).unwrap();

        uploadedImages.push({
          id: img.id,
          url: result.data.url, // Just store the URL
          uploaded: true,
        });

        // Update progress
        setUploadProgress(Math.round(((i + 1) / imagesToUpload.length) * 100));
      }

      // Combine already uploaded images with newly uploaded ones
      const finalImages = [
        ...images.filter((img) => img.uploaded),
        ...uploadedImages,
      ];

      setImages(finalImages);

      // Notify parent component with just the URLs
      updateParent(finalImages);
    } catch (error) {
      console.error('Error uploading images:', error);
      setErrors(['Failed to upload images. Please try again.']);
    } finally {
      setUploading(false);
    }
  };

  // Reset all images
  const resetImages = () => {
    // Only keep initially uploaded images
    if (initialImages && initialImages.length > 0) {
      setImages(
        initialImages.map((url) => ({
          id: Math.random().toString(36).substring(7),
          url: url,
          file: null,
          uploaded: true,
        }))
      );
    } else {
      setImages([]);
    }
    setErrors([]);

    // Update parent with original URLs
    onImagesChange(initialImages);
  };

  return (
    <div className='space-y-4'>
      {/* Error messages */}
      {errors.length > 0 && (
        <Alert variant='destructive'>
          <AlertDescription>
            <ul className='list-disc pl-5'>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Image count indicator */}
      <div className='flex items-center justify-between'>
        <div className='text-sm text-muted-foreground'>
          {images.length} of {MAX_FILES} images selected
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={resetImages}
          disabled={uploading}
          type='button'>
          <RefreshCw className='h-4 w-4 mr-2' />
          Reset
        </Button>
      </div>

      {/* Dropzone - reduced size */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/20'
        }`}>
        <input {...getInputProps()} />
        <div className='flex flex-col items-center justify-center space-y-2 py-4'>
          <Upload className='h-8 w-8 text-muted-foreground' />
          <p className='font-medium'>Drag & drop images here</p>
          <p className='text-sm text-muted-foreground'>
            Or click to select files (JPEG, PNG, WEBP, max 5MB each)
          </p>
        </div>
      </div>

      {/* Image previews */}
      {images.length > 0 && (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {images.map((image, index) => (
            <Card
              key={image.id}
              className='overflow-hidden group relative'>
              <div className='aspect-square relative overflow-hidden'>
                <img
                  src={image.url || '/placeholder.svg'}
                  alt={`Preview ${index + 1}`}
                  className='w-full h-full object-cover transition-transform group-hover:scale-110'
                />

                {/* Image actions overlay */}
                <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                  {!image.uploaded && (
                    <Button
                      size='icon'
                      variant='secondary'
                      onClick={() => openCropDialog(index)}
                      disabled={uploading}
                      type='button'>
                      <Crop className='h-4 w-4' />
                    </Button>
                  )}
                  <Button
                    size='icon'
                    variant='destructive'
                    onClick={() => removeImage(image.id)}
                    disabled={uploading}
                    type='button'>
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>

                {/* Status indicator */}
                {image.uploaded && (
                  <div className='absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full'>
                    Uploaded
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload button */}
      <div className='flex justify-end space-x-2'>
        <Button
          onClick={uploadImages}
          disabled={
            uploading || images.filter((img) => !img.uploaded).length === 0
          }
          type='button'>
          {uploading ? (
            <>
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
              Uploading...
            </>
          ) : (
            <>
              <Upload className='h-4 w-4 mr-2' />
              Upload Images
            </>
          )}
        </Button>
      </div>

      {/* Upload progress */}
      {uploading && (
        <div className='space-y-2'>
          <Progress value={uploadProgress} />
          <p className='text-sm text-center text-muted-foreground'>
            Uploading: {uploadProgress}%
          </p>
        </div>
      )}

      {/* Crop dialog */}
      <Dialog
        open={cropDialogOpen}
        onOpenChange={setCropDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>

          {currentImageIndex !== null && images[currentImageIndex] && (
            <div className='space-y-4'>
              <div className='relative h-80 w-full'>
                <Cropper
                  image={images[currentImageIndex].url}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className='flex justify-end space-x-2'>
                <Button
                  variant='outline'
                  onClick={() => setCropDialogOpen(false)}
                  type='button'>
                  Cancel
                </Button>
                <Button
                  onClick={createCroppedImage}
                  type='button'>
                  Apply Crop
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
