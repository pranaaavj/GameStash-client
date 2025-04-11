import { Loading } from '../error';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Outlet, useLocation, useNavigation } from 'react-router-dom';
import { Footer, Navbar, ScrollToTop } from '../common';
import { AnimatePresence } from 'framer-motion';

export const UserLayout = () => {
  const navigation = useNavigation();
  const location = useLocation();

  return (
    <div className='flex flex-col min-h-screen relative'>
      {/* Background pattern overlay */}
      <div className='fixed inset-0 opacity-5 bg-[radial-gradient(#5a9bf5_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0'></div>

      <Navbar />

      <ScrollToTop />
      <div className='pt-16 sm:px-8 md:px-12 lg:px-20 relative z-10'>
        <Breadcrumbs />
      </div>
      {navigation.state === 'loading' && <Loading />}
      <main className='w-full max-w-[75rem] px-4 sm:px-6 md:px-8 mx-auto min-h-[calc(100vh-var(--navbar-height)-var(--breadcrumb-height))] relative z-10'>
        <AnimatePresence mode='wait'>
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};
