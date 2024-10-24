import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  Home,
  PackagePlus,
  Settings,
  Users,
  PanelLeftOpen,
  PanelRightOpen,
} from 'lucide-react';
import Logo from '../../assets/images/logo.svg';

const navItems = [
  { name: 'Dashboard', icon: Home, to: '/admin/dashboard' },
  { name: 'Users', icon: Users, to: '/admin/page' },
  { name: 'Products', icon: PackagePlus, to: '/admin/products' },
  { name: 'Settings', icon: Settings, to: '/admin/settings' },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      window.innerWidth > 768 ? setIsOpen(true) : setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  });

  return (
    <motion.aside
      animate={{ width: isOpen ? '16rem' : '4rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className='flex flex-col h-screen text-secondary-text bg-primary-bg'>
      <div className='flex items-center justify-between p-4'>
        <NavLink
          to='/admin/dashboard'
          className='flex items-center'>
          <div className='flex space-x-3 text-primary-text'>
            <img
              src={Logo}
              className='w-8'
              alt=''
            />
          </div>
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className='ml-3 text-xl font-bold'>
                  <p>GameStash</p>
                </motion.span>
              </>
            )}
          </AnimatePresence>
        </NavLink>
      </div>

      <nav className='flex-grow mt-6'>
        <ul className='space-y-2 px-2'>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-200
                  ${isActive ? 'bg-secondary-bg text-primary-text' : 'bg-none'}
                  ${!isOpen && 'justify-center'}`
                }>
                <item.icon className='h-5 w-5' />
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className='ml-3'>
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className='p-4'>
        <span
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className='w-full'>
          {isOpen ? (
            <PanelLeftOpen className='h-6 w-6' />
          ) : (
            <PanelRightOpen className='h-6 w-6' />
          )}
        </span>
      </div>
    </motion.aside>
  );
};
