import { toast } from 'sonner';

export const uploadToCloudinary = async (blob) => {
  try {
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('upload_preset', 'product-images');
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dopbmvmkw/image/upload',
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    toast.error('Something went wrong.');
    console.log(error);
  }
};
