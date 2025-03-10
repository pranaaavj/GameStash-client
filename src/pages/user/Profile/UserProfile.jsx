import ProfileView from './ProfileView';
import { ChangePassword } from './ChangePassword';
import { Address } from './Address';

import { ModernWallet } from './ModernWallet';

export const UserProfile = () => {
  return (
    <div className='min-h-screen bg-primary-bg text-primary-text p-4 sm:p-6 lg:p-8'>
      <div className='max-w-6xl mx-auto space-y-8'></div>

      <div>
        <ProfileView />
        <div className='mt-8'>
          <Address />
        </div>
        <div className='mt-8'>
          <ChangePassword />
        </div>
        <div className='mt-8'>
          <ModernWallet />
        </div>
      </div>
    </div>
  );
};
