import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '../../shadcn/components/ui/avatar';
import logo from '../../assets/images/logo.svg';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';

//Todo: Complete the avatar icon, when the user logs in show avatar else show icon
export const Navbar = () => {
  const user = useUsers();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='bg-secondary-bg z-10 font-poppins fixed left-0 right-0 w-full'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-14'>
          <div className='flex-shrink-0 flex items-center'>
            <Link
              to='/'
              className='text-xl font-bold'>
              <div className='flex space-x-3 text-primary-text'>
                <img
                  src={logo}
                  className='w-8'
                  alt=''
                />
                <p>GameStash</p>
              </div>
            </Link>
          </div>

          <div className='hidden md:block'>
            <div className='flex items-baseline space-x-4'>
              <Link
                to='/games'
                className='text-primary-text hover:text-hover-red px-3 py-2 rounded-md text-sm font-medium'>
                Games
              </Link>
              <Link
                to='/user/support'
                className='text-primary-text hover:text-hover-red text-sm font-medium'>
                Support
              </Link>
              <Link
                to='/about'
                className='text-primary-text hover:text-hover-red px-3 py-2 rounded-md text-sm font-medium'>
                About
              </Link>
            </div>
          </div>

          <div className='hidden md:flex items-center space-x-6'>
            <button
              aria-label='Search'
              className='text-primary-text hover:text-hover-red'>
              <Search className='h-6 w-6' />
            </button>
            <Link
              to='/cart'
              aria-label='Shopping Cart'
              className='text-primary-text hover:text-hover-red'>
              <ShoppingCart className='h-6 w-6' />
            </Link>
            <Link
              to='/profile'
              aria-label='User Account'
              className='text-primary-text hover:text-hover-red flex items-center justify-center'>
              <Avatar className='w-10 h-10 bg-primary-bg rounded-full overflow-hidden flex items-center justify-center'>
                {user?.userInfo ? (
                  <AvatarImage
                    src={user?.userInfo?.profilePicture}
                    alt='User Avatar'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <AvatarFallback className='flex items-center justify-center w-full h-full bg-secondary-bg'>
                    <User className='h-6 w-6 text-primary-text' />
                  </AvatarFallback>
                )}
              </Avatar>
            </Link>
          </div>

          <div className='md:hidden flex items-center'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
              aria-expanded='false'>
              <span className='sr-only'>Open main menu</span>
              {isOpen ? (
                <X
                  className='block h-6 w-6'
                  aria-hidden='true'
                />
              ) : (
                <Menu
                  className='block h-6 w-6'
                  aria-hidden='true'
                />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
          <Link
            to='store'
            className='text-gray-600 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium'>
            Store
          </Link>
          <Link
            to='/user/support'
            className='text-gray-600 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium'>
            Support
          </Link>
          <Link
            to='about'
            className='text-gray-600 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium'>
            About
          </Link>
        </div>
        <div className='pt-4 pb-3 border-t border-gray-200'>
          <div className='flex items-center px-5'>
            <Link
              to='/account'
              aria-label='User Account'
              className='text-primary-text hover:text-hover-red'>
              <Avatar>
                <AvatarImage src='' />
                <AvatarFallback>
                  <User className='h-6 w-6' />
                </AvatarFallback>
              </Avatar>
            </Link>
            <Link
              to='/cart'
              aria-label='Shopping Cart'
              className='ml-auto text-primary-text hover:text-hover-red'>
              <ShoppingCart className='h-6 w-6' />
            </Link>
            <button
              aria-label='Search'
              className='ml-4 text-primary-text hover:text-hover-red'>
              <Search className='h-6 w-6' />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
