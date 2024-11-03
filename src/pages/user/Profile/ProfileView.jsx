import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent, CardFooter } from '@/shadcn/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shadcn/components/ui/avatar';
import { InputField } from '@/components/common';
import { User, Mail, Phone, Camera, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProfileView() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1 234 567 8900',
    status: 'Active',
    profilePicture: '/placeholder.svg',
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleEditModeToggle = () => {
    setIsEditMode((prev) => !prev);
    setValidationErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    // Simple validation checks
    if (!profileData.name) errors.name = 'Name is required.';
    if (!profileData.email) errors.email = 'Email is required.';

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;

    // Simulate successful update
    toast.success('Profile updated successfully');
    setIsEditMode(false);
  };

  return (
    <Card className='bg-gradient-to-br from-primary-bg to-secondary-bg border-none shadow-lg text-primary-text'>
      <div className='h-48 bg-secondary-bg/50 relative'>
        <div className='w-full h-full object-cover opacity-50'></div>
        <Button
          variant='outline'
          className='absolute bottom-4 right-4 bg-primary-bg/80 hover:bg-secondary-bg border-none'>
          <Camera className='mr-2 h-4 w-4' /> Change Cover
        </Button>
      </div>
      <div className='relative px-6'>
        <Avatar className='h-32 w-32 absolute -top-16 ring-4 ring-primary-bg'>
          <AvatarImage
            src={profileData.profilePicture}
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
            <CardFooter className='flex justify-end space-x-4 px-0'>
              <Button
                variant='outline'
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
        ) : (
          <div className='space-y-6'>
            <div>
              <h2 className='text-3xl font-bold'>{profileData.name}</h2>
              <p className='text-secondary-text'>
                @{profileData.name.toLowerCase().replace(' ', '')}
              </p>
            </div>
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
                <div className='text-secondary-text h-5 w-5 flex items-center justify-center'>
                  <div className='h-3 w-3 rounded-full bg-green-500'></div>
                </div>
                <div className='flex-grow'>
                  <p className='text-xs text-secondary-text'>Account Status</p>
                  <p className='text-primary-text mt-1'>{profileData.status}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {!isEditMode && (
        <CardFooter className='justify-end'>
          <Button
            onClick={handleEditModeToggle}
            className='bg-accent-blue hover:bg-hover-blue text-white'>
            <Edit2 className='mr-2 h-4 w-4' /> Edit Profile
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
