import { Sidebar } from '@/pages/admin';
import { Outlet } from 'react-router-dom';

export const AdminLayout = () => {
  return (
    <div className='flex h-screen'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className='flex flex-col flex-grow'>
        <main className='flex items-center justify-center p-6 bg-primary-bg text-primary-text overflow-y-auto h-full'>
          {/* Centered Outlet */}
          <div className='w-full max-w-4xl p-6 bg-secondary-bg rounded-lg shadow-lg'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
