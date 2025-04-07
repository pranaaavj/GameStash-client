// External Imports
import { ProfileView } from './ProfileView';
import { ChangePassword } from './ChangePassword';
import { ModernWallet } from './ModernWallet';

// Internal Imports
import { Address } from '@/components/user/Address';

export const UserProfile = () => {
  return (
    <div className='min-h-screen bg-primary-bg text-primary-text'>
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
  );
};
