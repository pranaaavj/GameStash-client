// /* eslint-disable react/prop-types */
// import { useState, useCallback, useRef, useEffect } from 'react';
// import Cropper from 'react-easy-crop';
// import { Button } from '@/shadcn/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/shadcn/components/ui/dialog';
// import { X, Upload, Edit, Save } from 'lucide-react';

// const createImage = (url) =>
//   new Promise((resolve, reject) => {
//     const image = new Image();
//     image.addEventListener('load', () => resolve(image));
//     image.addEventListener('error', (error) => reject(error));
//     image.setAttribute('crossOrigin', 'anonymous');
//     image.src = url;
//   });

// const getCroppedImg = async (imageSrc, pixelCrop) => {
//   const image = await createImage(imageSrc);
//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('2d');

//   if (!ctx) return null;

//   canvas.width = pixelCrop.width;
//   canvas.height = pixelCrop.height;

//   ctx.drawImage(
//     image,
//     pixelCrop.x,
//     pixelCrop.y,
//     pixelCrop.width,
//     pixelCrop.height,
//     0,
//     0,
//     pixelCrop.width,
//     pixelCrop.height
//   );

//   return new Promise((resolve) => {
//     canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
//   });
// };

// export const ImageCropper = ({ onCropComplete, initialImages = [] }) => {
//   const [images, setImages] = useState([]);
//   const [currentImage, setCurrentImage] = useState(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [aspect, setAspect] = useState(4 / 3);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [isCropperOpen, setIsCropperOpen] = useState(false);
//   const fileInputRef = useRef(null);

//   // Load initial images
//   useEffect(() => {
//     if (initialImages.length > 0) {
//       const loadedImages = initialImages.map((url) => ({
//         original: url,
//         cropped: url,
//       }));
//       setImages(loadedImages);
//     }
//   }, [initialImages]);

//   const handleFileChange = (event) => {
//     const files = Array.from(event.target.files);
//     const newImages = files.map((file) => ({
//       original: URL.createObjectURL(file),
//       cropped: null,
//     }));
//     setImages((prevImages) => [...prevImages, ...newImages]);
//   };

//   const onCropCompleteInternal = useCallback(
//     (croppedArea, croppedAreaPixels) => {
//       setCroppedAreaPixels(croppedAreaPixels);
//     },
//     []
//   );

//   const saveCroppedImage = useCallback(async () => {
//     try {
//       const blob = await getCroppedImg(
//         currentImage.original,
//         croppedAreaPixels
//       );

//       // Generate a URL for the cropped blob and update images array
//       const croppedUrl = URL.createObjectURL(blob);
//       setImages((prevImages) =>
//         prevImages.map((img) =>
//           img.original === currentImage.original
//             ? { ...img, cropped: croppedUrl }
//             : img
//         )
//       );
//       setIsCropperOpen(false);
//       onCropComplete(croppedUrl); // Pass URL to parent
//     } catch (e) {
//       console.error(e);
//     }
//   }, [croppedAreaPixels, currentImage, onCropComplete]);

//   const openCropper = (image) => {
//     setCurrentImage(image);
//     setIsCropperOpen(true);
//   };

//   return (
//     <div className='p-4'>
//       <div className='mb-4'>
//         <Button
//           type='button'
//           onClick={() => fileInputRef.current.click()}>
//           <Upload className='w-4 h-4 mr-2' />
//           Upload Images
//         </Button>
//         <input
//           type='file'
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           accept='image/*'
//           multiple
//           className='hidden'
//         />
//       </div>

//       <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
//         {images.length > 0 &&
//           images.map((image, index) => (
//             <div
//               key={index}
//               className='relative'>
//               <img
//                 src={image.cropped || image.original}
//                 alt={`Uploaded ${index + 1}`}
//                 className='w-full h-40 object-cover rounded-lg'
//               />
//               <Button
//                 variant='outline'
//                 size='icon'
//                 type='button'
//                 className='absolute top-2 right-2'
//                 onClick={() => openCropper(image)}>
//                 <Edit className='h-4 w-4 text-primary-b' />
//               </Button>
//             </div>
//           ))}
//       </div>

//       <Dialog
//         open={isCropperOpen}
//         onOpenChange={setIsCropperOpen}>
//         <DialogContent className='sm:max-w-[425px]'>
//           <DialogHeader>
//             <DialogTitle>Crop Image</DialogTitle>
//           </DialogHeader>
//           <div className='relative h-64 w-full'>
//             {currentImage && (
//               <Cropper
//                 image={currentImage.original}
//                 crop={crop}
//                 zoom={zoom}
//                 aspect={aspect}
//                 onCropChange={setCrop}
//                 onCropComplete={onCropCompleteInternal}
//                 onZoomChange={setZoom}
//               />
//             )}
//           </div>
//           <div className='flex justify-between mt-4'>
//             <Button
//               type='button'
//               onClick={() => setIsCropperOpen(false)}
//               variant='outline'>
//               <X className='w-4 h-4 mr-2' /> Close
//             </Button>
//             <select
//               value={aspect}
//               onChange={(e) => setAspect(parseFloat(e.target.value))}
//               className='mx-1 rounded bg-gray-800 text-sm text-center text-white'>
//               <option value={1}>1:1 (Square)</option>
//               <option value={4 / 3}>4:3 (Standard)</option>
//               <option value={16 / 9}>16:9 (Widescreen)</option>
//               <option value={3 / 2}>3:2</option>
//             </select>
//             <Button
//               type='button'
//               onClick={saveCroppedImage}>
//               <Save className='w-4 h-4 mr-2' /> Save Crop
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// // Address card on the side
// import { Button } from '@/shadcn/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from '@/shadcn/components/ui/card';
// import { InputField } from '@/components/common';
// import { MapPin, Plus, Trash2, Edit2, Save } from 'lucide-react';
// import {
//   useGetAllAddressesQuery,
//   useAddAddressMutation,
//   useEditAddressMutation,
//   useDeleteAddressMutation,
// } from '@/redux/api/user/userApi';
// import { toast } from 'sonner';

// const initialAddressState = {
//   addressName: '',
//   addressLine: '',
//   line2: '',
//   city: '',
//   state: '',
//   zip: '',
//   country: '',
// };

// export function Address() {
//   const [addresses, setAddresses] = useState([]);
//   const [addressForm, setAddressForm] = useState(initialAddressState);
//   const [editingId, setEditingId] = useState(null);
//   const [isAddingNew, setIsAddingNew] = useState(false);

//   // API Hooks
//   const { data: responseAddresses } = useGetAllAddressesQuery();
//   const [addAddress] = useAddAddressMutation();
//   const [editAddress] = useEditAddressMutation();
//   const [deleteAddress] = useDeleteAddressMutation();

//   // Load addresses
//   useEffect(() => {
//     if (responseAddresses) {
//       setAddresses(responseAddresses.data);
//     }
//   }, [responseAddresses]);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setAddressForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // Add a new address
//   const handleAddAddress = async (e) => {
//     e.preventDefault();
//     try {
//       const newAddress = await addAddress(addressForm).unwrap();
//       setAddresses((prev) => [...prev, newAddress.data]);
//       setAddressForm(initialAddressState);
//       setIsAddingNew(false);
//       toast.success('Address added successfully!');
//     } catch (error) {
//       console.log(error);
//       toast.error('Failed to add address');
//     }
//   };

//   // Edit an address
//   const handleEditAddress = async (e) => {
//     e.preventDefault();
//     try {
//       const updatedAddress = await editAddress({
//         id: editingId,
//         ...addressForm,
//       }).unwrap();
//       setAddresses((prev) =>
//         prev.map((addr) => (addr.id === editingId ? updatedAddress.data : addr))
//       );
//       setAddressForm(initialAddressState);
//       setEditingId(null);
//       toast.success('Address updated successfully!');
//     } catch (error) {
//       console.log(error);

//       toast.error('Failed to update address');
//     }
//   };

//   // Delete an address
//   const handleDeleteAddress = async (id) => {
//     try {
//       await deleteAddress(id).unwrap();
//       setAddresses((prev) => prev.filter((addr) => addr.id !== id));
//       toast.success('Address deleted successfully!');
//     } catch (error) {
//       console.log(error);

//       toast.error('Failed to delete address');
//     }
//   };

//   // Toggle edit mode
//   const toggleEdit = (id) => {
//     const address = addresses.find((addr) => addr.id === id);
//     setAddressForm(address);
//     setEditingId(id);
//     setIsAddingNew(false);
//   };

//   return (
//     <Card className='bg-gradient-to-br from-primary-bg to-secondary-bg border-none shadow-lg text-primary-text overflow-hidden'>
//       <CardHeader className='bg-accent-blue/10 border-b border-accent-blue/20'>
//         <CardTitle className='text-3xl font-bold flex items-center'>
//           <MapPin className='w-8 h-8 mr-2 text-accent-blue' />
//           Shipping Destinations
//         </CardTitle>
//       </CardHeader>
//       <CardContent className='p-4 sm:p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
//         {/* Display Existing Addresses */}
//         {addresses.map((address) => (
//           <Card
//             key={address.id}
//             className='bg-primary-bg/50 border border-accent-blue/20 shadow-md hover:shadow-lg transition-all duration-300'>
//             <CardContent className='p-4 space-y-4'>
//               {editingId === address.id ? (
//                 <form
//                   onSubmit={handleEditAddress}
//                   className='space-y-4'>
//                   <InputField
//                     label='Location Name'
//                     placeholder='Location Name'
//                     name='addressName'
//                     type='text'
//                     value={addressForm.addressName}
//                     onChange={handleChange}
//                     isInvalid={false}
//                     errorMessage=''
//                     className='text-sm py-2'
//                   />
//                   <InputField
//                     label='Address Line 1'
//                     placeholder='Address Line 1'
//                     name='addressLine'
//                     type='text'
//                     value={addressForm.addressLine}
//                     onChange={handleChange}
//                     isInvalid={false}
//                     errorMessage=''
//                     className='text-sm py-2'
//                   />
//                   <InputField
//                     label='Address Line 2 (Optional)'
//                     placeholder='Address Line 2'
//                     name='line2'
//                     type='text'
//                     value={addressForm.line2}
//                     onChange={handleChange}
//                     isInvalid={false}
//                     errorMessage=''
//                     className='text-sm py-2'
//                   />
//                   <div className='grid grid-cols-2 gap-2'>
//                     <InputField
//                       label='City'
//                       placeholder='City'
//                       name='city'
//                       type='text'
//                       value={addressForm.city}
//                       onChange={handleChange}
//                       isInvalid={false}
//                       errorMessage=''
//                       className='text-sm py-2'
//                     />
//                     <InputField
//                       label='State/Province'
//                       placeholder='State/Province'
//                       name='state'
//                       type='text'
//                       value={addressForm.state}
//                       onChange={handleChange}
//                       isInvalid={false}
//                       errorMessage=''
//                       className='text-sm py-2'
//                     />
//                   </div>
//                   <div className='grid grid-cols-2 gap-2'>
//                     <InputField
//                       label='ZIP/Postal Code'
//                       placeholder='ZIP/Postal Code'
//                       name='zip'
//                       type='text'
//                       value={addressForm.zip}
//                       onChange={handleChange}
//                       isInvalid={false}
//                       errorMessage=''
//                       className='text-sm py-2'
//                     />
//                     <InputField
//                       label='Country'
//                       placeholder='Country'
//                       name='country'
//                       type='text'
//                       value={addressForm.country}
//                       onChange={handleChange}
//                       isInvalid={false}
//                       errorMessage=''
//                       className='text-sm py-2'
//                     />
//                   </div>
//                   <div className='flex justify-end'>
//                     <Button
//                       type='submit'
//                       size='sm'
//                       className='bg-accent-blue hover:bg-hover-blue text-white'>
//                       <Save className='w-4 h-4 mr-2' /> Save
//                     </Button>
//                   </div>
//                 </form>
//               ) : (
//                 <div className='flex justify-between items-start'>
//                   <div>
//                     <h3 className='font-bold text-lg text-accent-blue'>
//                       {address.addressName || 'Unnamed Location'}
//                     </h3>
//                     <p className='text-sm text-secondary-text'>
//                       {address.addressLine}
//                     </p>
//                     {address.line2 && (
//                       <p className='text-sm text-secondary-text'>
//                         {address.line2}
//                       </p>
//                     )}
//                     <p className='text-sm text-secondary-text'>
//                       {address.city}, {address.state} {address.zip}
//                     </p>
//                     <p className='text-sm text-secondary-text'>
//                       {address.country}
//                     </p>
//                   </div>
//                   <div className='flex space-x-2'>
//                     <Button
//                       size='icon'
//                       variant='ghost'
//                       onClick={() => toggleEdit(address.id)}
//                       className='text-accent-blue hover:bg-accent-blue/20'>
//                       <Edit2 className='w-4 h-4' />
//                     </Button>
//                     <Button
//                       size='icon'
//                       variant='ghost'
//                       onClick={() => handleDeleteAddress(address.id)}
//                       className='text-red-500 hover:bg-red-500/20'>
//                       <Trash2 className='w-4 h-4' />
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         ))}

//         {/* New Address Form */}
//         {isAddingNew && (
//           <Card className='bg-primary-bg/50 border border-accent-blue/20 shadow-md'>
//             <CardContent className='p-4 space-y-4'>
//               <form
//                 onSubmit={handleAddAddress}
//                 className='space-y-4'>
//                 <InputField
//                   label='Location Name'
//                   placeholder='Location Name'
//                   name='addressName'
//                   type='text'
//                   value={addressForm.addressName}
//                   onChange={handleChange}
//                   className='text-sm py-2'
//                 />
//                 <InputField
//                   label='Address Line 1'
//                   placeholder='Address Line 1'
//                   name='addressLine'
//                   type='text'
//                   value={addressForm.addressLine}
//                   onChange={handleChange}
//                   className='text-sm py-2'
//                 />
//                 <InputField
//                   label='Address Line 2 (Optional)'
//                   placeholder='Address Line 2'
//                   name='line2'
//                   type='text'
//                   value={addressForm.line2}
//                   onChange={handleChange}
//                   className='text-sm py-2'
//                 />
//                 <div className='grid grid-cols-2 gap-2'>
//                   <InputField
//                     label='City'
//                     placeholder='City'
//                     name='city'
//                     type='text'
//                     value={addressForm.city}
//                     onChange={handleChange}
//                     className='text-sm py-2'
//                   />
//                   <InputField
//                     label='State/Province'
//                     placeholder='State/Province'
//                     name='state'
//                     type='text'
//                     value={addressForm.state}
//                     onChange={handleChange}
//                     className='text-sm py-2'
//                   />
//                 </div>
//                 <div className='grid grid-cols-2 gap-2'>
//                   <InputField
//                     label='ZIP/Postal Code'
//                     placeholder='ZIP/Postal Code'
//                     name='zip'
//                     type='text'
//                     value={addressForm.zip}
//                     onChange={handleChange}
//                     className='text-sm py-2'
//                   />
//                   <InputField
//                     label='Country'
//                     placeholder='Country'
//                     name='country'
//                     type='text'
//                     value={addressForm.country}
//                     onChange={handleChange}
//                     className='text-sm py-2'
//                   />
//                 </div>
//                 <div className='flex justify-end'>
//                   <Button
//                     type='submit'
//                     size='sm'
//                     className='bg-accent-blue hover:bg-hover-blue text-white'>
//                     <Save className='w-4 h-4 mr-2' /> Save Address
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         )}

//         {/* Button to Show New Address Form */}
//         <Card
//           className='bg-primary-bg/30 border-2 border-dashed border-accent-blue/30 flex items-center justify-center p-6 cursor-pointer hover:bg-primary-bg/50 transition-colors duration-300'
//           onClick={() => {
//             setIsAddingNew(true);
//             setEditingId(null);
//             setAddressForm(initialAddressState);
//           }}>
//           <div className='text-center'>
//             <Plus className='w-12 h-12 mx-auto text-accent-blue mb-2' />
//             <p className='font-medium text-accent-blue'>Add New Address</p>
//           </div>
//         </Card>
//       </CardContent>
//     </Card>
//   );
// }
