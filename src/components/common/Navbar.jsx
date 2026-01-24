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
import { useNavigate, useLocation } from 'react-router-dom';
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
} from 'lucide-react';
import { showToast } from '@/utils';

export const Navbar = ({ onCartClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUsers();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredMobileItem, setHoveredMobileItem] = useState(null);
  const [logoutUser] = useLogoutUserMutation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
    persistor.purge();
    showToast.success('You have been successfully logged out');
  };


  const handleNavClick = (path) => {
    if (path === '/cart' && onCartClick) {
      onCartClick();
    }
    navigate(path);
  };

  const navItems = [
    { path: '/games', label: 'Games' },
    { path: '/about', label: 'About' },
    { path: '/support', label: 'Support' },
    { path: '/cart', label: 'Cart' },
  ];

  return (
    <motion.nav className='z-50 font-poppins fixed left-0 right-0 w-full bg-transparent pt-1'>
      <div className='w-full px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo Section - Left aligned */}
          <motion.div
            className='flex-shrink-0 flex items-center'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}>
            <button
              onClick={() => navigate('/')}
              className='flex items-center space-x-3 text-primary-text'>
              <motion.img
                src={logo}
                className='w-8 h-8'
                alt='GameStash Logo'
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
              <p className='text-lg font-medium bg-primary-bg/30 px-2 py-0.5 rounded'>
                GameStash
              </p>
            </button>
          </motion.div>

          {/* Center Navigation - Pill Design */}
          <div className='hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2'>
            <motion.div className='relative bg-secondary-bg/60 backdrop-blur-md rounded-full px-2 py-2 flex items-center space-x-1'>
              {navItems.map((item) => {
                const isItemHovered = hoveredItem === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    onMouseEnter={() => setHoveredItem(item.path)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className='relative z-10'>
                    <div
                      className={`px-5 py-2 rounded-full text-sm font-normal relative flex items-center space-x-1.5 transition-none ${
                        isItemHovered ? 'text-black' : 'text-primary-text'
                      }`}>
                      {item.icon && <span>{item.icon}</span>}
                      <span>{item.label}</span>
                    </div>

                    {/* Hover Background */}
                    <AnimatePresence>
                      {isItemHovered && (
                        <motion.div
                          className='absolute inset-0 rounded-full bg-accent-red/80'
                          initial={{ opacity: 0, scale: 1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={{
                            duration: 0.15,
                            ease: 'easeOut',
                          }}
                          style={{ zIndex: -1 }}
                        />
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </motion.div>
          </div>

          {/* Right Section: Search and Login - Right aligned */}
          <div className='hidden md:flex items-center space-x-4'>
            <SearchBar
              isSearchVisible={isSearchVisible}
              setIsSearchVisible={setIsSearchVisible}
            />

            {/* User Avatar / Sign-In Button */}
            {user?.userInfo ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    className='flex items-center space-x-2 cursor-pointer outline-none'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}>
                    <Avatar className='w-8 h-8 ring-2 ring-accent-red/20 hover:ring-accent-red/40 transition-all'>
                      <AvatarImage
                        src={user.userInfo.profilePicture}
                        alt='User Avatar'
                      />
                      <AvatarFallback className='bg-accent-red/20 text-accent-red'>
                        <User className='h-4 w-4' />
                      </AvatarFallback>
                    </Avatar>
                    <span className='text-primary-text text-sm font-normal max-w-[3.75rem] truncate'>
                      {user.userInfo.name.split(' ')[0]}
                    </span>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  className='bg-secondary-bg/95 backdrop-blur-md border-primary-bg/10 shadow-xl border rounded-2xl min-w-[180px] p-2'
                  sideOffset={12}>
                  <DropdownMenuLabel className='text-primary-text text-xs font-normal opacity-60 px-3 py-2'>
                    {user.userInfo.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className='bg-primary-bg/10 my-1' />
                  
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className='text-primary-text hover:text-primary-text focus:text-primary-text hover:bg-accent-red/10 focus:bg-accent-red/10 cursor-pointer rounded-lg px-3 py-2 transition-colors'>
                    <Settings className='h-4 w-4 mr-3' />
                    <span className='text-sm font-normal'>Profile</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem
                    onClick={() => navigate('/orders')}
                    className='text-primary-text hover:text-primary-text focus:text-primary-text hover:bg-accent-red/10 focus:bg-accent-red/10 cursor-pointer rounded-lg px-3 py-2 transition-colors'>
                    <Package className='h-4 w-4 mr-3' />
                    <span className='text-sm font-normal'>Orders</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem
                    onClick={() => navigate('/wishlist')}
                    className='text-primary-text hover:text-primary-text focus:text-primary-text hover:bg-accent-red/10 focus:bg-accent-red/10 cursor-pointer rounded-lg px-3 py-2 transition-colors'>
                    <Heart className='h-4 w-4 mr-3' />
                    <span className='text-sm font-normal'>Wishlist</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className='bg-primary-bg/10 my-1' />
                  
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className='text-accent-red hover:text-accent-red focus:text-accent-red hover:bg-accent-red/10 focus:bg-accent-red/10 cursor-pointer rounded-lg px-3 py-2 transition-colors'>
                    <LogOut className='h-4 w-4 mr-3' />
                    <span className='text-sm font-normal'>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.button
                onClick={() => navigate('/login')}
                className='px-7 py-2 rounded-full bg-accent-red text-white text-sm font-normal shadow-lg'
                whileHover={{
                  backgroundColor: '#1c1c1c',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}>
                Sign In
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className='md:hidden flex items-center space-x-2'>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className='text-primary-text hover:text-accent-red hover:bg-secondary-bg/50'>
                <Search className='h-6 w-6' />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                  if (onCartClick) onCartClick();
                  navigate('/cart');
                }}
                className='text-primary-text hover:text-accent-red hover:bg-secondary-bg/50'>
                <ShoppingCart className='h-6 w-6' />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsOpen(!isOpen)}
                className='text-primary-text hover:text-accent-red hover:bg-secondary-bg/50'
                aria-label='Toggle menu'>
                {isOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className='md:hidden bg-secondary-bg/95 backdrop-blur-md border-t border-primary-bg/20'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}>
            <div className='px-4 pt-4 pb-6 space-y-2'>
              {isSearchVisible && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='mb-4'>
                  <SearchBar
                    isSearchVisible={isSearchVisible}
                    setIsSearchVisible={setIsSearchVisible}
                    isMobile={true}
                  />
                </motion.div>
              )}

              {/* User info */}
              {user?.userInfo ? (
                <motion.div
                  className='flex items-center space-x-3 py-3 mb-2'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}>
                  <Avatar className='w-10 h-10 ring-2 ring-accent-red/20'>
                    <AvatarImage
                      src={user.userInfo.profilePicture}
                      alt='User Avatar'
                    />
                    <AvatarFallback className='bg-accent-red/20 text-accent-red'>
                      <User className='h-5 w-5' />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='text-primary-text font-normal text-sm'>
                      {user.userInfo.name}
                    </p>
                    <p className='text-primary-text/60 text-xs font-normal'>
                      {user.userInfo.email}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className='mb-2'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}>
                  <button
                    onClick={() => navigate('/login')}
                    className='w-full px-7 py-2.5 rounded-full bg-accent-red text-white text-sm font-normal shadow-lg'>
                    Sign In
                  </button>
                </motion.div>
              )}

              {/* Mobile nav links with pill style */}
              <div className='bg-secondary-bg/60 backdrop-blur-md rounded-2xl p-2 space-y-1'>
                {[
                  { to: '/', icon: Home, label: 'Home' },
                  ...navItems.map((item) => ({
                    to: item.path,
                    icon: item.path === '/cart' ? ShoppingCart : null,
                    label: item.label,
                    onClick: item.path === '/cart' ? onCartClick : undefined,
                  })),
                  ...(user?.userInfo
                    ? [
                        { to: '/profile', icon: Settings, label: 'Profile' },
                        { to: '/orders', icon: Package, label: 'Orders' },
                        { to: '/wishlist', icon: Heart, label: 'Wishlist' },
                      ]
                    : []),
                ].map((item, index) => {
                  const Icon = item.icon;
                  const isItemHovered = hoveredMobileItem === item.to;
                  
                  return (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.03 }}>
                      <button
                        onClick={() => {
                          if (item.onClick) item.onClick();
                          navigate(item.to);
                        }}
                        onMouseEnter={() => setHoveredMobileItem(item.to)}
                        onMouseLeave={() => setHoveredMobileItem(null)}
                        className='w-full relative'>
                        <div
                          className={`flex items-center space-x-3 py-2.5 px-3 rounded-xl transition-none relative z-10 ${
                            isItemHovered ? 'text-black' : 'text-primary-text'
                          }`}>
                          {Icon && <Icon className='h-4 w-4' />}
                          <span className='text-sm font-normal'>{item.label}</span>
                        </div>
                        
                        {/* Hover Background */}
                        <AnimatePresence>
                          {isItemHovered && (
                            <motion.div
                              className='absolute inset-0 rounded-xl bg-accent-red/80'
                              initial={{ opacity: 0, scale: 1 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.85 }}
                              transition={{
                                duration: 0.15,
                                ease: 'easeOut',
                              }}
                              style={{ zIndex: 0 }}
                            />
                          )}
                        </AnimatePresence>
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Logout button */}
              {user?.userInfo && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={handleLogout}
                  className='text-accent-red hover:bg-accent-red/10 flex items-center space-x-3 py-2.5 px-3 rounded-xl transition-colors w-full mt-2'>
                  <LogOut className='h-4 w-4' />
                  <span className='text-sm font-normal'>Logout</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};