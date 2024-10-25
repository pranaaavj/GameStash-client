import { Sidebar } from '@/pages/admin';
import { Outlet } from 'react-router-dom';

export const AdminLayout = () => {
  return (
    <div className='flex h-screen'>
      <Sidebar />

      <div className='flex flex-col w-full h-full'>
        <main className='p-6 bg-primary-bg text-primary-text w-full h-full'>
          <div className='flex flex-col h-full p-6 bg-secondary-bg rounded-lg shadow-lg overflow-y-auto'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
