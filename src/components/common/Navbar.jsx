/* eslint-disable react/prop-types */
'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shadcn/components/ui/avatar';
import { Button } from '@/shadcn/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shadcn/components/ui/dropdown-menu';
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useUsers } from '@/hooks';
import { useLogoutUserMutation } from '@/redux/api/user/authApi';
import { logout } from '@/redux/slices/userSlice';
import logo from '@/assets/images/logo.svg';

export const Navbar = ({ onCartClick }) => {
  const user = useUsers();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
  };

  return (
    <nav className='bg-secondary-bg z-10 font-poppins fixed left-0 right-0 w-full shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex-shrink-0 flex items-center'>
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

          <div className='hidden md:flex items-center space-x-4'>
            <Link
              to='/games'
              className='text-primary-text hover:text-accent-red px-3 py-2 rounded-md text-sm font-medium transition-colors'>
              Games
            </Link>
            <Link
              to='/user/support'
              className='text-primary-text hover:text-accent-red px-3 py-2 rounded-md text-sm font-medium transition-colors'>
              Support
            </Link>
            <Link
              to='/about'
              className='text-primary-text hover:text-accent-red px-3 py-2 rounded-md text-sm font-medium transition-colors'>
              About
            </Link>
          </div>

          <div className='hidden md:flex items-center space-x-4'>
            <div className='flex items-center space-x-4'>
              <Button
                variant='ghost'
                size='icon'
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
            </div>

            <div className='w-[100px] flex justify-end'>
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
                      <span className='text-primary-text text-sm font-medium max-w-[60px] truncate'>
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

          <div className='md:hidden flex items-center'>
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

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:hidden bg-secondary-bg border-t border-primary-bg/20`}>
        <div className='px-2 pt-2 pb-3 space-y-1'>
          <Link
            to='/games'
            className='text-primary-text hover:text-accent-red block px-3 py-2 rounded-md text-base font-medium'>
            Games
          </Link>
          <Link
            to='/user/support'
            className='text-primary-text hover:text-accent-red block px-3 py-2 rounded-md text-base font-medium'>
            Support
          </Link>
          <Link
            to='/about'
            className='text-primary-text hover:text-accent-red block px-3 py-2 rounded-md text-base font-medium'>
            About
          </Link>
        </div>
        <div className='pt-4 pb-3 border-t border-primary-bg/20'>
          <div className='flex items-center justify-between px-5'>
            <div className='flex items-center space-x-4'>
              <Button
                variant='ghost'
                size='icon'
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
            </div>
            <div className='w-[150px] flex justify-end'>
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
                      <span className='text-primary-text text-sm font-medium max-w-[100px] truncate'>
                        {user.userInfo.name}
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
                    <DropdownMenuItem className='text-primary-text hover:text-accent-red hover:bg-primary-bg/10'>
                      <Link
                        to='/profile'
                        className='w-full'>
                        Profile
                      </Link>
                    </DropdownMenuItem>
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
        </div>
      </div>
    </nav>
  );
};
