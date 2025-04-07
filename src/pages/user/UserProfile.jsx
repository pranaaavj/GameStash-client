import { ProfileView } from './ProfileView';
import { ChangePassword } from './ChangePassword';
import { ModernWallet } from './ModernWallet';

import { Address } from '@/components/user/Address';
import { PageTransition } from '@/components/common';

export const UserProfile = () => {
  return (
    <PageTransition>
      <div className='min-h-screen bg-transparent text-primary-text'>
        <div className='max-w-6xl mx-auto'>
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
    </PageTransition>
  );
};
