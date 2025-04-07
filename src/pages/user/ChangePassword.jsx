import { useCallback, useState } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shadcn/components/ui/card';
import { Button } from '@/shadcn/components/ui/button';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/shadcn/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';

import { InputField } from '@/components/common';

import { useChangeUserPassMutation } from '@/redux/api/user/profileApi';
import { useUsers } from '@/hooks';

import { validateChangePassword, showToast, handleApiError } from '@/utils';

export const ChangePassword = () => {
  const user = useUsers();

  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  const [changeUserPass, { isLoading }] = useChangeUserPassMutation();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateChangePassword(passwordData);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const response = await changeUserPass({
        userId: user?.userInfo?.id,
        passData: {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
      }).unwrap();

      if (response?.success) {
        showToast.success('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <Card className='bg-secondary-bg border-none text-primary-text shadow-lg'>
      <CardHeader>
        <CardTitle className='text-2xl'>Security Settings</CardTitle>
        <CardDescription>
          Manage your password and security preferences
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Collapsible
          open={isPasswordOpen}
          onOpenChange={setIsPasswordOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant='outline'
              onClick={() => setIsPasswordOpen((prev) => !prev)}
              className='w-full justify-between bg-primary-bg/50 border-none hover:bg-primary-bg/40 hover:text-secondary-text mt-4'>
              Change Password
              <ChevronRight
                className={`h-5 w-5 transition-transform ${
                  isPasswordOpen ? 'rotate-90' : ''
                }`}
              />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <form
              onSubmit={handleSubmit}
              className='mt-4 space-y-6'>
              <InputField
                label='Current Password'
                type='password'
                name='currentPassword'
                value={passwordData.currentPassword}
                onChange={handleChange}
                isInvalid={!!validationErrors.currentPassword}
                errorMessage={validationErrors.currentPassword}
                placeHolder='Enter your current password'
              />

              <InputField
                label='New Password'
                type='password'
                name='newPassword'
                value={passwordData.newPassword}
                onChange={handleChange}
                isInvalid={!!validationErrors.newPassword}
                errorMessage={validationErrors.newPassword}
                placeHolder='Enter your new password'
              />

              <InputField
                label='Confirm New Password'
                type='password'
                name='confirmNewPassword'
                value={passwordData.confirmNewPassword}
                onChange={handleChange}
                isInvalid={!!validationErrors.confirmNewPassword}
                errorMessage={validationErrors.confirmNewPassword}
                placeHolder='Confirm your new password'
              />

              <div className='flex justify-end'>
                <Button
                  type='submit'
                  className='bg-accent-blue hover:bg-hover-blue text-white'
                  disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
