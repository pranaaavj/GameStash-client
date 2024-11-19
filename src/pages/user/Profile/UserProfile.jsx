import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shadcn/components/ui/tabs';

import { User, MapPin, ShoppingBag } from 'lucide-react';
import ProfileView from './ProfileView';
import { ChangePassword } from './ChangePassword';
import { Address } from './Address';
import { Orders } from './Orders';

export const UserProfile = () => {
  return (
    <div className='min-h-screen bg-primary-bg text-primary-text p-4 sm:p-6 lg:p-8'>
      <div className='max-w-6xl mx-auto space-y-8'>
        <Tabs
          defaultValue='profile'
          className='w-full'>
          <TabsList className='w-full grid grid-cols-3 gap-4 bg-transparent p-0 mb-20'>
            {[
              { value: 'profile', label: 'Profile', icon: User },
              { value: 'address', label: 'Address', icon: MapPin },
              { value: 'orders', label: 'Orders', icon: ShoppingBag },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className='data-[state=active]:bg-secondary-bg data-[state=active]:text-primary-text bg-primary-bg/50 border-none shadow-none h-24 flex flex-col items-center justify-center gap-2'>
                <Icon className='h-6 w-6' />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Profile View */}
          <TabsContent value='profile'>
            <ProfileView />
            <div className='mt-8'>
              <ChangePassword />
            </div>
          </TabsContent>

          {/* Address management */}
          <TabsContent value='address'>
            <Address />
          </TabsContent>

          {/* Orders */}
          <TabsContent value='orders'>
            <Orders />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
