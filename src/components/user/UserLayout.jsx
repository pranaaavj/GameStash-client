import { Footer, Navbar, ScrollToTop } from '../common';
import { Outlet, useNavigation } from 'react-router-dom';
import { Breadcrumbs } from '../common/Breadcrumbs';
import Loading from '../common/Loading';

export const UserLayout = () => {
  const navigation = useNavigation();

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <div className='pt-16 pl-20'>
        <Breadcrumbs />
      </div>
      {navigation.state && <Loading />}
      <ScrollToTop />
      <main className='flex-grow mx-20'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
