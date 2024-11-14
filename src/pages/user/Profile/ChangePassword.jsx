/* eslint-disable react/prop-types */
import { useState } from 'react';
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
import { ChevronRight, CircleX } from 'lucide-react';
import { Alert, InputField } from '@/components/common';
import { useChangeUserPassMutation } from '@/redux/api/user/profileApi';
import { toast } from 'sonner';
import { validateChangePassword } from '@/utils';
import { useUsers } from '@/hooks';

export const ChangePassword = () => {
  const user = useUsers();
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [changeUserPass, { isLoading, isError, error }] =
    useChangeUserPassMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

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
        toast.success('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      }
    } catch (error) {
      console.error('Error updating password', error);
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
              {isError && (
                <Alert
                  Icon={CircleX}
                  variant='destructive'
                  description={
                    error?.data?.message || 'Error editing profile profile'
                  }
                />
              )}
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
