import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shadcn/components/ui/avatar';
import { Button } from '@/shadcn/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardHeader,
} from '@/shadcn/components/ui/card';
import { Camera, Edit2, Mail, Phone, User, CircleX } from 'lucide-react';
import { Alert, InputField } from '@/components/common';
import { useState, useEffect } from 'react';
import {
  useGetProfileDetailsQuery,
  // useEditProfileMutation,
} from '@/redux/api/userApi';
// import { toast } from 'sonner';

const initialProfileState = {
  name: '',
  email: '',
  phoneNumber: '',
  profilePicture: '',
  status: '',
};

export const ProfileDetails = () => {
  const [profileData, setProfileData] = useState(initialProfileState);
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const { data: profileDetails, isError, error } = useGetProfileDetailsQuery();
  // const [editProfile, { isError: isEditError, error: editError }] =
  //   useEditProfileMutation();

  useEffect(() => {
    if (profileDetails) {
      setProfileData({
        name: profileDetails.data.name,
        email: profileDetails.data.email,
        phoneNumber: profileDetails.data.phoneNumber || '',
        profilePicture: profileDetails.data.profilePicture,
        status: profileDetails.data.status,
      });
    }
  }, [profileDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleEditModeToggle = () => {
    setIsEditMode((prev) => !prev);
    if (!isEditMode) setValidationErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!profileData.name) errors.name = 'Name is required.';
    if (!profileData.email) errors.email = 'Email is required.';
    setValidationErrors(errors);

    if (Object.keys(errors).length) return;

    // try {
    //   const response = await editProfile(profileData).unwrap();
    //   if (response.success) {
    //     toast.success('Profile updated successfully');
    //     setIsEditMode(false);
    //   }
    // } catch (err) {
    //   console.error(err);
    // }
  };

  return (
    <Card className='bg-gradient-to-br from-primary-bg to-secondary-bg border-none shadow-lg text-primary-text'>
      <CardHeader className='bg-primary-bg/10'>
        <CardTitle className='text-2xl font-bold text-center'>
          Profile Details
        </CardTitle>
      </CardHeader>
      <div className='h-48 bg-secondary-bg/50 relative'>
        <Button
          variant='outline'
          className='absolute bottom-4 right-4 bg-primary-bg/80 hover:bg-secondary-bg border-none'>
          <Camera className='mr-2 h-4 w-4' /> Change Cover
        </Button>
      </div>
      <div className='relative px-6'>
        <Avatar className='h-32 w-32 absolute -top-16 ring-4 ring-primary-bg'>
          <AvatarImage
            src={profileData.profilePicture || '/placeholder.svg'}
            alt='Profile picture'
          />
          <AvatarFallback>
            {profileData.name?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <CardContent className='pt-20 space-y-6'>
        {isEditMode ? (
          <form
            onSubmit={handleSubmit}
            className='space-y-4'>
            <InputField
              type='text'
              label='Name'
              name='name'
              value={profileData.name}
              onChange={handleChange}
              isInvalid={!!validationErrors.name}
              errorMessage={validationErrors.name}
            />
            <InputField
              type='email'
              label='Email'
              name='email'
              value={profileData.email}
              onChange={handleChange}
              isInvalid={!!validationErrors.email}
              errorMessage={validationErrors.email}
            />
            <InputField
              type='tel'
              label='Phone Number'
              name='phoneNumber'
              value={profileData.phoneNumber}
              onChange={handleChange}
              placeholder='Enter your phone number'
            />
            <CardFooter className='flex justify-end space-x-4'>
              <Button
                variant='outline'
                onClick={handleEditModeToggle}
                className='bg-secondary-bg text-primary-text'>
                Cancel
              </Button>
              <Button
                type='submit'
                className='bg-accent-blue hover:bg-hover-blue text-white'>
                Save Changes
              </Button>
            </CardFooter>
          </form>
        ) : (
          <div className='space-y-4'>
            <div className='flex items-center space-x-4'>
              <User className='text-secondary-text h-5 w-5' />
              <div className='flex-grow'>
                <p className='text-xs text-secondary-text'>Name</p>
                <p className='text-primary-text mt-1'>{profileData.name}</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Mail className='text-secondary-text h-5 w-5' />
              <div className='flex-grow'>
                <p className='text-xs text-secondary-text'>Email</p>
                <p className='text-primary-text mt-1'>{profileData.email}</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <Phone className='text-secondary-text h-5 w-5' />
              <div className='flex-grow'>
                <p className='text-xs text-secondary-text'>Phone Number</p>
                <p className='text-primary-text mt-1'>
                  {profileData.phoneNumber || 'Not provided'}
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-secondary-text h-5 w-5'>Status</span>
              <div className='flex-grow'>
                <p className='text-xs text-secondary-text'>Account Status</p>
                <p className='text-primary-text mt-1'>{profileData.status}</p>
              </div>
            </div>
            <CardFooter className='flex justify-end'>
              <Button
                onClick={handleEditModeToggle}
                className='bg-accent-blue hover:bg-hover-blue text-white'>
                <Edit2 className='mr-2 h-4 w-4' /> Edit Profile
              </Button>
            </CardFooter>
          </div>
        )}
      </CardContent>
      {isError && (
        <Alert
          Icon={CircleX}
          variant='destructive'
          description={error?.data?.message || 'Error loading profile'}
        />
      )}
      {/* {isEditError && (
        <Alert
          Icon={CircleX}
          variant='destructive'
          description={editError?.data?.message || 'Error updating profile'}
        />
      )} */}
    </Card>
  );
};
