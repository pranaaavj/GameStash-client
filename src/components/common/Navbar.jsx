/* eslint-disable react/prop-types */
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shadcn/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shadcn/components/ui/dropdown-menu';
import logo from '@/assets/images/logo.svg';
import { Link } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { logout } from '@/redux/slices/userSlice';
import { Button } from '@/shadcn/components/ui/button';
import { useUsers } from '@/hooks';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLogoutUserMutation } from '@/redux/api/user/authApi';
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';

export const Navbar = ({ onCartClick }) => {
  const user = useUsers();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
  };

  return (
    <nav className='bg-secondary-bg z-10 font-poppins fixed left-0 right-0 w-full shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo Section */}
          <div className='flex-shrink-0 flex items-center w-[12rem]'>
            <Link
              to='/'
              className='text-xl font-bold'>
              <div className='flex items-center space-x-3 text-primary-text'>
                <img
                  src={logo}
                  className='w-8 h-8'
                  alt='GameStash Logo'
                />
                <p>GameStash</p>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links */}
          <div className='hidden md:flex flex-1 justify-center items-center space-x-8'>
            <Link
              to='/games'
              className='text-primary-text hover:text-accent-red px-3 py-2 text-sm font-medium transition-colors'>
              Games
            </Link>
            <Link
              to='/user/support'
              className='text-primary-text hover:text-accent-red px-3 py-2 text-sm font-medium transition-colors'>
              Support
            </Link>
            <Link
              to='/about'
              className='text-primary-text hover:text-accent-red px-3 py-2 text-sm font-medium transition-colors'>
              About
            </Link>
          </div>

          {/* Right Section: Icons and User */}
          <div className='hidden md:flex items-center space-x-4 w-[12rem] justify-end'>
            <SearchBar
              isSearchVisible={isSearchVisible}
              setIsSearchVisible={setIsSearchVisible}
            />
            {/* Icons */}
            <div className='flex items-center space-x-4'>
              <Button
                variant='ghost'
                size='icon'
                onClick={onCartClick}
                className='text-primary-text hover:text-accent-red hover:bg-primary-bg/10'>
                <ShoppingCart className='h-6 w-6' />
              </Button>
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-primary-text hover:text-accent-red hover:bg-primary-bg/10 relative'>
                    <Bell className='h-6 w-6' />
                    <span className='absolute top-0 right-0 h-2 w-2 bg-accent-red rounded-full'></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  className='w-56 bg-secondary-bg border-primary-bg/20'>
                  <DropdownMenuLabel className='text-primary-text'>
                    Notifications
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className='text-primary-text hover:text-accent-red hover:bg-primary-bg/10'>
                    New game release: Cyberpunk 2077
                  </DropdownMenuItem>
                  <DropdownMenuItem className='text-primary-text hover:text-accent-red hover:bg-primary-bg/10'>
                    Your order has been shipped
                  </DropdownMenuItem>
                  <DropdownMenuItem className='text-primary-text hover:text-accent-red hover:bg-primary-bg/10'>
                    Weekend sale: 50% off on all RPGs
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
            </div>

            {/* User Avatar / Sign-In */}
            <div className='w-[6.25rem] flex justify-end'>
              {user?.userInfo ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className='flex items-center space-x-2 cursor-pointer'>
                      <Avatar className='w-8 h-8'>
                        <AvatarImage
                          src={user.userInfo.profilePicture}
                          alt='User Avatar'
                        />
                        <AvatarFallback>
                          <User className='h-4 w-4' />
                        </AvatarFallback>
                      </Avatar>
                      <span className='text-primary-text text-sm font-medium max-w-[3.75rem] truncate'>
                        {user.userInfo.name.split(' ')[0]}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='bg-secondary-bg border-primary-bg/20'>
                    <DropdownMenuLabel className='text-primary-text'>
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link
                      to='/profile'
                      className='w-full'>
                      <DropdownMenuItem className='text-primary-text hover:text-accent-red hover:bg-primary-bg/10'>
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <Link
                      to='/orders'
                      className='w-full'>
                      <DropdownMenuItem className='text-primary-text hover:text-accent-red hover:bg-primary-bg/10'>
                        Orders
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className='text-primary-text hover:text-accent-red hover:bg-primary-bg/10'>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to='/auth/login'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='bg-accent-red text-primary-text border-none hover:bg-accent-red/90 text-sm w-full'>
                    <User className='w-4 h-4 mr-2' />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Hamburger Menu */}
          <div className='md:hidden flex items-center space-x-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className='text-primary-text hover:text-accent-red hover:bg-primary-bg/10'>
              <Search className='h-6 w-6' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={onCartClick}
              className='text-primary-text hover:text-accent-red hover:bg-primary-bg/10'>
              <ShoppingCart className='h-6 w-6' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsOpen(!isOpen)}
              className='text-primary-text hover:text-accent-red hover:bg-primary-bg/10'>
              {isOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='md:hidden bg-secondary-bg border-t border-primary-bg/20'>
          <div className='px-4 pt-4 pb-2 space-y-4'>
            {isSearchVisible && (
              <SearchBar
                isSearchVisible={isSearchVisible}
                setIsSearchVisible={setIsSearchVisible}
              />
            )}
            <Link
              to='/games'
              className='text-primary-text hover:text-accent-red block text-base font-medium'>
              Games
            </Link>
            <Link
              to='/user/support'
              className='text-primary-text hover:text-accent-red block text-base font-medium'>
              Support
            </Link>
            <Link
              to='/about'
              className='text-primary-text hover:text-accent-red block text-base font-medium'>
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
