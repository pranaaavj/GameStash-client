import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shadcn/components/ui/avatar';
import {
  useGetProfileDetailsQuery,
  useEditUserProfileMutation,
} from '@/redux/api/user/userApi';
import { Alert } from '@/components/common';
import { toast } from 'sonner';
import { Button } from '@/shadcn/components/ui/button';
import { useUsers } from '@/hooks';
import { InputField } from '@/components/common';
import { validateProfile } from '@/utils';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/shadcn/components/ui/card';
import { User, Mail, Phone, Camera, Edit2, CircleX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const emptyProfileInput = {
  name: '',
  phoneNumber: '',
  profilePicture: '',
};

export default function ProfileView() {
  const user = useUsers();

  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState(emptyProfileInput);
  const [validationErrors, setValidationErrors] = useState({});

  const {
    data: responseUserDetails,
    isError: isUserDetailsError,
    error: userDetailsError,
  } = useGetProfileDetailsQuery(user?.userInfo?.id, {
    skip: !user?.userInfo,
  });

  const [
    editUserProfile,
    { isError: isEditProfileError, error: editProfileError },
  ] = useEditUserProfileMutation();

  useEffect(() => {
    if (responseUserDetails) {
      setProfileData({
        name: responseUserDetails?.data?.name,
        phoneNumber: responseUserDetails?.data?.phoneNumber,
        profilePicture: responseUserDetails?.data?.profilePicture,
      });
    }
  }, [responseUserDetails]);

  const handleEditModeToggle = () => {
    setIsEditMode((prev) => !prev);
    if (!isEditMode) setValidationErrors(emptyProfileInput);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateProfile(profileData);
    setValidationErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const responseEditProfile = await editUserProfile({
        userId: user?.userInfo?.id,
        newUserInfo: profileData,
      }).unwrap();
      if (responseEditProfile?.success) {
        toast.success('Profile updated successfully');
        setIsEditMode(false);
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  return (
    <Card className='bg-gradient-to-br from-primary-bg to-secondary-bg border-none shadow-lg text-primary-text p-6 md:p-8'>
      <div className='h-56 bg-secondary-bg/50 relative'>
        <div className='w-full h-full object-cover opacity-50'></div>
        <Button
          variant='outline'
          className='absolute bottom-4 right-4 bg-primary-bg/80 hover:bg-secondary-bg border-none'>
          <Camera className='mr-2 h-5 w-5' /> Change Cover
        </Button>
      </div>
      <div className='relative px-8 md:px-10'>
        <Avatar className='h-36 w-36 md:h-40 md:w-40 absolute -top-20 ring-4 ring-primary-bg'>
          <AvatarImage
            src={profileData?.profilePicture}
            alt='Profile picture'
          />
          <AvatarFallback>
            {profileData?.name?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Set a fixed min-height for CardContent to prevent layout shifts */}
      <CardContent
        className='pt-24 space-y-8'
        style={{ minHeight: '300px' }}>
        <AnimatePresence mode='wait'>
          {isEditMode ? (
            <motion.div
              key='edit-form'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}>
              <h3 className='text-2xl font-semibold mb-4'>Edit Profile</h3>
              <form
                onSubmit={handleSubmit}
                className='space-y-6'>
                <InputField
                  type='text'
                  label='Name'
                  name='name'
                  value={profileData?.name}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.name}
                  errorMessage={validationErrors.name}
                />
                <InputField
                  type='number'
                  label='Phone Number'
                  name='phoneNumber'
                  value={profileData?.phoneNumber}
                  onChange={handleChange}
                  placeholder='Enter your phone number'
                  isInvalid={!!validationErrors.phoneNumber}
                  errorMessage={validationErrors.phoneNumber}
                />
                <CardFooter className='flex justify-end space-x-6 px-0'>
                  <Button
                    variant='outline'
                    type='button'
                    onClick={handleEditModeToggle}
                    className='bg-secondary-bg text-primary-text hover:bg-primary-bg/50'>
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    className='bg-accent-blue hover:bg-hover-blue text-white'>
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key='profile-view'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className='space-y-6'>
              <div>
                <h2 className='text-4xl font-bold'>{profileData?.name}</h2>
              </div>
              <div className='space-y-6'>
                <div className='flex items-center space-x-6'>
                  <User className='text-secondary-text h-6 w-6' />
                  <div className='flex-grow'>
                    <p className='text-sm text-secondary-text'>Name</p>
                    <p className='text-lg text-primary-text mt-1'>
                      {profileData?.name}
                    </p>
                  </div>
                </div>
                <div className='flex items-center space-x-6'>
                  <Mail className='text-secondary-text h-6 w-6' />
                  <div className='flex-grow'>
                    <p className='text-sm text-secondary-text'>Email</p>
                    <p className='text-lg text-primary-text mt-1'>
                      {responseUserDetails?.data?.email || ''}
                    </p>
                  </div>
                </div>
                <div className='flex items-center space-x-6'>
                  <Phone className='text-secondary-text h-6 w-6' />
                  <div className='flex-grow'>
                    <p className='text-sm text-secondary-text'>Phone Number</p>
                    <p className='text-lg text-primary-text mt-1'>
                      {profileData?.phoneNumber || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className='flex items-center space-x-6'>
                  <div className='text-secondary-text h-6 w-6 flex items-center justify-center'>
                    <div className='h-4 w-4 rounded-full bg-green-500'></div>
                  </div>
                  <div className='flex-grow'>
                    <p className='text-sm text-secondary-text'>
                      Account Status
                    </p>
                    <p className='text-lg text-primary-text mt-1'>
                      {responseUserDetails?.data?.status || ''}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      {!isEditMode && (
        <CardFooter className='justify-end'>
          <Button
            onClick={handleEditModeToggle}
            className='bg-accent-blue hover:bg-hover-blue text-white'>
            <Edit2 className='mr-2 h-5 w-5' /> Edit Profile
          </Button>
        </CardFooter>
      )}
      {isUserDetailsError && (
        <Alert
          Icon={CircleX}
          variant='destructive'
          description={
            userDetailsError?.data?.message || 'Error loading profile'
          }
        />
      )}
      {isEditProfileError && (
        <Alert
          Icon={CircleX}
          variant='destructive'
          description={
            editProfileError?.data?.message || 'Error editing profile profile'
          }
        />
      )}
    </Card>
  );
}
