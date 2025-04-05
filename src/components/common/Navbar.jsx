import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { logout } from '@/redux/slices/userSlice';
import { Button } from '@/shadcn/components/ui/button';
import { persistor } from '@/redux/store';
import { useUsers } from '@/hooks';
import { useDispatch } from 'react-redux';
import { useLogoutUserMutation } from '@/redux/api/user/authApi';
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
  LogOut,
  Heart,
  Package,
  Settings,
  Home,
  Gamepad2,
  HelpCircle,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

export const Navbar = ({ onCartClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUsers();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoutUser] = useLogoutUserMutation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
    persistor.purge();
    toast.success('You have been successfully logged out');
  };

  // Check if a nav link is active
  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <nav
      className={`bg-secondary-bg z-20 font-poppins fixed left-0 right-0 w-full transition-all duration-300 ${
        scrolled ? 'shadow-lg navbar-scrolled' : 'shadow-md'
      }`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo Section */}
          <motion.div
            className='flex-shrink-0 flex items-center w-[12rem]'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}>
            <Link
              to='/'
              className='text-xl font-bold'>
              <div className='flex items-center space-x-3 text-primary-text'>
                <motion.img
                  src={logo}
                  className='w-8 h-8'
                  alt='GameStash Logo'
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
                <p>GameStash</p>
              </div>
            </Link>
          </motion.div>

          {/* Center Navigation Links */}
          <div className='hidden md:flex flex-1 justify-center items-center space-x-8'>
            {[
              {
                path: '/games',
                label: 'Games',
                icon: <Gamepad2 className='h-4 w-4 mr-1' />,
              },
              {
                path: '/support',
                label: 'Support',
                icon: <HelpCircle className='h-4 w-4 mr-1' />,
              },
              {
                path: '/about',
                label: 'About',
                icon: <Info className='h-4 w-4 mr-1' />,
              },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-primary-text hover:text-accent-red px-3 py-2 text-sm font-medium transition-colors flex items-center relative ${
                  isActive(item.path) ? 'text-accent-red' : ''
                }`}>
                {item.icon}
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    className='absolute bottom-0 left-0 w-full h-0.5 bg-accent-red'
                    layoutId='navbar-indicator'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Section: Icons and User */}
          <div className='hidden md:flex items-center space-x-4 w-[12rem] justify-end'>
            <SearchBar
              isSearchVisible={isSearchVisible}
              setIsSearchVisible={setIsSearchVisible}
            />
            {/* Icons */}
            <div className='flex items-center space-x-4'>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => navigate('/cart')}
                  className='text-primary-text hover:text-accent-red hover:bg-primary-bg/10 transition-colors'>
                  <ShoppingCart className='h-6 w-6' />
                </Button>
              </motion.div>
            </div>

            {/* User Avatar / Sign-In */}
            <div className='w-[6.35rem] flex justify-end'>
              {user?.userInfo ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      className='flex items-center space-x-2 cursor-pointer border-none ring-0'
                      whileTap={{ scale: 0.95 }}>
                      <Avatar className='w-8 h-8 transition-all duration-200'>
                        <AvatarImage
                          src={user.userInfo.profilePicture}
                          alt='User Avatar'
                        />
                        <AvatarFallback className='bg-accent-red/20 text-accent-red'>
                          <User className='h-4 w-4' />
                        </AvatarFallback>
                      </Avatar>
                      <span className='text-primary-text text-sm font-medium max-w-[3.75rem] truncate'>
                        {user.userInfo.name.split(' ')[0]}
                      </span>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='bg-secondary-bg border-primary-bg/20 shadow-lg border'
                    sideOffset={8}>
                    <DropdownMenuLabel className='text-primary-text '>
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link
                      to='/profile'
                      className='w-full'>
                      <DropdownMenuItem className='text-primary-text focus:text-accent-blue focus:bg-primary-bg/50'>
                        <Settings className='h-4 w-4 mr-2' />
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <Link
                      to='/orders'
                      className='w-full'>
                      <DropdownMenuItem className='text-primary-text focus:text-accent-blue focus:bg-primary-bg/50'>
                        <Package className='h-4 w-4 mr-2' />
                        Orders
                      </DropdownMenuItem>
                    </Link>
                    <Link
                      to='/wishlist'
                      className='w-full'>
                      <DropdownMenuItem className='text-primary-text focus:text-accent-blue focus:bg-primary-bg/50'>
                        <Heart className='h-4 w-4 mr-2' />
                        Wishlist
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className='text-accent-red focus:text-hover-red focus:bg-primary-bg/50'>
                      <LogOut className='h-4 w-4 mr-2' />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to='/auth/login'>
                  <motion.div>
                    <Button
                      variant='outline'
                      size='sm'
                      className='bg-accent-red text-primary-text border-none hover:bg-accent-red/90 text-sm w-full'>
                      <User className='w-4 h-4 mr-2' />
                      Sign In
                    </Button>
                  </motion.div>
                </Link>
              )}
            </div>
          </div>

          {/* Hamburger Menu */}
          <div className='md:hidden flex items-center space-x-2'>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className='text-primary-text hover:text-accent-red hover:bg-primary-bg/10'>
                <Search className='h-6 w-6' />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}>
              <Button
                variant='ghost'
                size='icon'
                onClick={onCartClick}
                className='text-primary-text hover:text-accent-red hover:bg-primary-bg/10'>
                <ShoppingCart className='h-6 w-6' />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsOpen(!isOpen)}
                className='text-primary-text hover:text-accent-red hover:bg-primary-bg/10'
                aria-label='Toggle menu'>
                {isOpen ? (
                  <X className='h-6 w-6' />
                ) : (
                  <Menu className='h-6 w-6' />
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className='md:hidden bg-secondary-bg border-t border-primary-bg/20'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <div className='px-4 pt-4 pb-6 space-y-4'>
              {isSearchVisible && (
                <SearchBar
                  isSearchVisible={isSearchVisible}
                  setIsSearchVisible={setIsSearchVisible}
                  isMobile={true}
                />
              )}

              {/* User info in mobile menu */}
              {user?.userInfo ? (
                <div className='flex items-center space-x-3 py-2 border-b border-primary-bg/10 mb-4'>
                  <Avatar className='w-10 h-10'>
                    <AvatarImage
                      src={user.userInfo.profilePicture}
                      alt='User Avatar'
                    />
                    <AvatarFallback className='bg-accent-red/20 text-accent-red'>
                      <User className='h-5 w-5' />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='text-primary-text font-medium'>
                      {user.userInfo.name}
                    </p>
                    <p className='text-primary-text/60 text-xs'>
                      {user.userInfo.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className='py-2 border-b border-primary-bg/10 mb-4'>
                  <Link to='/auth/login'>
                    <Button
                      variant='outline'
                      className='bg-accent-red text-primary-text border-none hover:bg-accent-red/90 text-sm w-full'>
                      <User className='w-4 h-4 mr-2' />
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}

              {/* Navigation links */}
              <Link
                to='/'
                className={`text-primary-text hover:text-accent-red flex items-center space-x-3 py-3 px-2 rounded-md transition-colors ${
                  isActive('/') ? 'bg-primary-bg/10 text-accent-red' : ''
                }`}>
                <Home className='h-5 w-5' />
                <span className='text-base font-medium'>Home</span>
              </Link>

              <Link
                to='/games'
                className={`text-primary-text hover:text-accent-red flex items-center space-x-3 py-3 px-2 rounded-md transition-colors ${
                  isActive('/games') ? 'bg-primary-bg/10 text-accent-red' : ''
                }`}>
                <Gamepad2 className='h-5 w-5' />
                <span className='text-base font-medium'>Games</span>
              </Link>

              {user?.userInfo && (
                <>
                  <Link
                    to='/profile'
                    className={`text-primary-text hover:text-accent-red flex items-center space-x-3 py-3 px-2 rounded-md transition-colors ${
                      isActive('/profile')
                        ? 'bg-primary-bg/10 text-accent-red'
                        : ''
                    }`}>
                    <Settings className='h-5 w-5' />
                    <span className='text-base font-medium'>Profile</span>
                  </Link>

                  <Link
                    to='/orders'
                    className={`text-primary-text hover:text-accent-red flex items-center space-x-3 py-3 px-2 rounded-md transition-colors ${
                      isActive('/orders')
                        ? 'bg-primary-bg/10 text-accent-red'
                        : ''
                    }`}>
                    <Package className='h-5 w-5' />
                    <span className='text-base font-medium'>Orders</span>
                  </Link>

                  <Link
                    to='/wishlist'
                    className={`text-primary-text hover:text-accent-red flex items-center space-x-3 py-3 px-2 rounded-md transition-colors ${
                      isActive('/wishlist')
                        ? 'bg-primary-bg/10 text-accent-red'
                        : ''
                    }`}>
                    <Heart className='h-5 w-5' />
                    <span className='text-base font-medium'>Wishlist</span>
                  </Link>
                </>
              )}

              <Link
                to='/support'
                className={`text-primary-text hover:text-accent-red flex items-center space-x-3 py-3 px-2 rounded-md transition-colors ${
                  isActive('/support') ? 'bg-primary-bg/10 text-accent-red' : ''
                }`}>
                <HelpCircle className='h-5 w-5' />
                <span className='text-base font-medium'>Support</span>
              </Link>

              <Link
                to='/about'
                className={`text-primary-text hover:text-accent-red flex items-center space-x-3 py-3 px-2 rounded-md transition-colors ${
                  isActive('/about') ? 'bg-primary-bg/10 text-accent-red' : ''
                }`}>
                <Info className='h-5 w-5' />
                <span className='text-base font-medium'>About</span>
              </Link>

              {user?.userInfo && (
                <button
                  onClick={handleLogout}
                  className='text-accent-red hover:text-accent-red/80 flex items-center space-x-3 py-3 px-2 rounded-md transition-colors w-full mt-4 border-t border-primary-bg/10 pt-4'>
                  <LogOut className='h-5 w-5' />
                  <span className='text-base font-medium'>Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
