import { Footer, Navbar, ScrollToTop } from '../common';
import { Outlet } from 'react-router-dom';
import { Breadcrumbs } from '../common/Breadcrumbs';

export const UserLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <div className='pt-16 pl-20'>
        <Breadcrumbs />
      </div>
      <ScrollToTop />
      <main className='flex-grow mx-20'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
