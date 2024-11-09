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
    <Card className='bg-gradient-to-br from-primary-bg to-secondary-bg border-none shadow-lg text-primary-text p-4'>
      <div className='relative h-32 bg-secondary-bg/50 rounded-md mb-4'>
        <Button
          variant='outline'
          className='absolute bottom-2 right-2 bg-primary-bg/80 hover:bg-secondary-bg border-none'>
          <Camera className='mr-1 h-4 w-4' /> Change Cover
        </Button>
        <Avatar className='h-20 w-20 absolute -bottom-10 left-4 ring-4 ring-primary-bg'>
          <AvatarImage
            src={profileData?.profilePicture}
            alt='Profile picture'
          />
          <AvatarFallback>
            {profileData?.name?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <CardContent className='pt-10'>
        <AnimatePresence mode='wait'>
          {isEditMode ? (
            <motion.div
              key='edit-form'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}>
              <h3 className='text-xl font-semibold mb-2'>Edit Profile</h3>
              <form
                onSubmit={handleSubmit}
                className='space-y-4'>
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
                <CardFooter className='flex justify-end space-x-4 px-0'>
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
              className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold'>{profileData?.name}</h2>
                <Button
                  size='sm'
                  onClick={handleEditModeToggle}
                  className='bg-accent-blue hover:bg-hover-blue text-white'>
                  <Edit2 className='mr-1 h-4 w-4' /> Edit
                </Button>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='flex items-center space-x-3'>
                  <Mail className='text-secondary-text h-5 w-5' />
                  <p className='text-sm text-primary-text'>
                    {responseUserDetails?.data?.email || 'Not provided'}
                  </p>
                </div>
                <div className='flex items-center space-x-3'>
                  <Phone className='text-secondary-text h-5 w-5' />
                  <p className='text-sm text-primary-text'>
                    {profileData?.phoneNumber || 'Not provided'}
                  </p>
                </div>
                <div className='flex items-center space-x-3 col-span-1'>
                  <User className='text-secondary-text h-5 w-5' />
                  <p className='text-sm text-primary-text'>
                    Account Status: {responseUserDetails?.data?.status || ''}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      {/* Error Handling */}
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
            editProfileError?.data?.message || 'Error editing profile'
          }
        />
      )}
    </Card>
  );
}
