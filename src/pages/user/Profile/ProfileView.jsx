import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shadcn/components/ui/avatar';
import {
  useGetProfileDetailsQuery,
  useEditUserProfileMutation,
} from '@/redux/api/user/profileApi';
import { Alert } from '@/components/common';
import { toast } from 'sonner';
import { Button } from '@/shadcn/components/ui/button';
import { useUsers } from '@/hooks';
import { InputField } from '@/components/common';
import { validateProfile } from '@/utils';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import {
  User,
  Mail,
  Phone,
  Edit2,
  CircleX,
  ShoppingCart,
  CreditCard,
  Star,
} from 'lucide-react';
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
    <div className='min-h-screen bg-gradient-to-br from-primary-bg to-secondary-bg rounded-xl text-primary-text p-4 sm:p-6 md:p-8'>
      <Card className='bg-secondary-bg/50 border-none shadow-xl overflow-hidden backdrop-blur-sm'>
        <CardContent className='p-0'>
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-primary-bg to-secondary-bg'></div>
            <div className='relative z-10 p-6 sm:p-8 md:p-10'>
              <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6'>
                <div className='relative'>
                  <div className='absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-red rounded-full text-primary-text opacity-50'></div>
                  <Avatar className='h-32 w-32 ring-4 ring-secondary-bg relative z-10'>
                    <AvatarImage
                      src={profileData?.profilePicture}
                      alt='Profile picture'
                    />
                    <AvatarFallback className='text-4xl font-bold bg-primary-bg'>
                      {profileData?.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className='text-center sm:text-left flex-1'>
                  <h2 className='text-3xl font-bold mb-2 bg-gradient-to-r from-accent-blue to-accent-red text-transparent bg-clip-text'>
                    {profileData?.name || 'Gamer'}
                  </h2>
                  <p className='text-secondary-text mb-4'>
                    @{responseUserDetails?.data?.username || 'username'}
                  </p>
                  <div className='flex flex-wrap justify-center sm:justify-start gap-4 mb-6 text-primary-text '>
                    <div className='flex items-center gap-2 bg-primary-bg/50 rounded-full px-4 py-2'>
                      <ShoppingCart className='text-accent-blue h-5 w-5' />
                      <span className='text-sm'>12 Orders</span>
                    </div>
                    <div className='flex items-center gap-2 bg-primary-bg/50 rounded-full px-4 py-2'>
                      <CreditCard className='text-accent-red h-5 w-5' />
                      <span className='text-sm'>$500 Spent</span>
                    </div>
                    <div className='flex items-center gap-2 bg-primary-bg/50 rounded-full px-4 py-2'>
                      <Star className='text-yellow-400 h-5 w-5' />
                      <span className='text-sm'>Gold Member</span>
                    </div>
                  </div>
                  {!isEditMode && (
                    <Button
                      size='sm'
                      onClick={handleEditModeToggle}
                      className='bg-accent-blue hover:bg-accent-blue/90 text-white'>
                      <Edit2 className='mr-2 h-4 w-4' /> Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              <AnimatePresence mode='wait'>
                {isEditMode ? (
                  <motion.div
                    key='edit-form'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className='mt-8 '>
                    <h3 className='text-xl font-semibold mb-4 text-accent-blue'>
                      Edit Your Profile
                    </h3>
                    <form
                      onSubmit={handleSubmit}
                      className='space-y-4 text-primary-text '>
                      <InputField
                        type='text'
                        label='Name'
                        name='name'
                        value={profileData?.name}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.name}
                        errorMessage={validationErrors.name}
                        className='bg-primary-bg/50 border-primary-bg'
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
                        className='bg-primary-bg/50 border-primary-bg'
                      />
                      <div className='flex justify-end space-x-4'>
                        <Button
                          variant='outline'
                          type='button'
                          onClick={handleEditModeToggle}
                          className='bg-primary-bg text-primary-text hover:bg-secondary-bg'>
                          Cancel
                        </Button>
                        <Button
                          type='submit'
                          className='bg-accent-blue hover:bg-accent-blue/90 text-white'>
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key='profile-view'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className='mt-8 space-y-6 text-primary-text '>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-4'>
                        <div className='flex items-center space-x-3 bg-primary-bg/30 p-3 rounded-lg'>
                          <Mail className='text-accent-blue h-5 w-5' />
                          <p className='text-sm'>
                            {responseUserDetails?.data?.email || 'Not provided'}
                          </p>
                        </div>
                        <div className='flex items-center space-x-3 bg-primary-bg/30 p-3 rounded-lg'>
                          <Phone className='text-accent-blue h-5 w-5' />
                          <p className='text-sm'>
                            {profileData?.phoneNumber || 'Not provided'}
                          </p>
                        </div>
                        <div className='flex items-center space-x-3 bg-primary-bg/30 p-3 rounded-lg'>
                          <User className='text-accent-blue h-5 w-5' />
                          <p className='text-sm'>
                            Account Status:{' '}
                            <span className='font-medium text-accent-green'>
                              {responseUserDetails?.data?.status || 'Active'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className='space-y-4'>
                        <div className='bg-primary-bg/30 p-4 rounded-lg'>
                          <h4 className='text-lg font-semibold mb-2 text-accent-blue'>
                            Recent Purchases
                          </h4>
                          <ul className='space-y-2'>
                            <li className='flex justify-between items-center'>
                              <span className='text-sm'>Cyberpunk 2077</span>
                              <span className='text-xs text-secondary-text'>
                                3 days ago
                              </span>
                            </li>
                            <li className='flex justify-between items-center'>
                              <span className='text-sm'>Gaming Mouse</span>
                              <span className='text-xs text-secondary-text'>
                                1 week ago
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className='bg-primary-bg/30 rounded-lg p-4'>
                      <h3 className='text-lg font-semibold mb-2 text-accent-blue'>
                        Your Gaming Interests
                      </h3>
                      <div className='flex flex-wrap gap-2'>
                        {['RPG', 'FPS', 'Strategy', 'Indie', 'VR'].map(
                          (genre) => (
                            <span
                              key={genre}
                              className='bg-secondary-bg/50 text-xs px-2 py-1 rounded-full'>
                              {genre}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div className='bg-primary-bg/30 rounded-lg p-4'>
                      <h3 className='text-lg font-semibold mb-2 text-accent-blue'>
                        Upcoming Releases You Might Like
                      </h3>
                      <ul className='space-y-2'>
                        <li className='flex justify-between items-center'>
                          <span className='text-sm'>Elden Ring 2</span>
                          <span className='text-xs text-secondary-text'>
                            Coming in 2 months
                          </span>
                        </li>
                        <li className='flex justify-between items-center'>
                          <span className='text-sm'>Half-Life 3</span>
                          <span className='text-xs text-secondary-text'>
                            Coming in 6 months
                          </span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}
