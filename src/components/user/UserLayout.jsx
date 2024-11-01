import { Footer, Navbar } from '../common';
import { Outlet } from 'react-router-dom';

export const UserLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <main className='flex-grow mt-10 mx-20'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
