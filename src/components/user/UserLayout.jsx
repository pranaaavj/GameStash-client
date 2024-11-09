import { Loading } from '../error';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Outlet, useNavigation } from 'react-router-dom';
import { Footer, Navbar, ScrollToTop } from '../common';
import Cart from '@/pages/user/Cart';
import { useState } from 'react';

export const UserLayout = () => {
  const navigation = useNavigation();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <ScrollToTop />
      <div className='pt-16 pl-20'>
        <Breadcrumbs />
      </div>
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      {navigation.state === 'loading' && <Loading />}
      <main className='flex-grow mx-20'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
