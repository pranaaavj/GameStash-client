import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const flattenRoutes = (routes, parentPath = '') => {
  let flatRoutes = [];

  routes.forEach((route) => {
    const path = route.path
      ? parentPath
        ? `${parentPath}/${route.path}`
        : route.path
      : parentPath;

    if (route.meta) {
      flatRoutes.push({
        path,
        meta: route.meta,
      });
    }

    if (route.children) {
      flatRoutes = [...flatRoutes, ...flattenRoutes(route.children, path)];
    }
  });

  return flatRoutes;
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const generateBreadcrumbs = async () => {
      const { userRoutes } = await import('@/routes/user.routes');
      const { authRoutes } = await import('@/routes/auth.routes');

      const flattenedUserRoutes = flattenRoutes(userRoutes);
      const flattenedAuthRoutes = flattenRoutes(authRoutes);

      const allFlattenedRoutes = [
        ...flattenedUserRoutes,
        ...flattenedAuthRoutes,
      ];

      if (location.pathname === '/') {
        setBreadcrumbs([]);
        return;
      }

      const currentPath = location.pathname.endsWith('/')
        ? location.pathname.slice(0, -1)
        : location.pathname;

      const crumbs = [{ name: 'Home', path: '/' }];
      const pathSegments = currentPath.split('/').filter(Boolean);

      if (pathSegments.length > 0) {
        let cumulativePath = '';

        for (let i = 0; i < pathSegments.length; i++) {
          const segment = pathSegments[i];
          cumulativePath += `/${segment}`;

          const matchingRoute = allFlattenedRoutes.find((route) => {
            if (route.path === cumulativePath.substring(1)) return true;

            if (route.path && route.path.includes(':')) {
              const routeRegex = new RegExp(
                `^${route.path.replace(/:[^/]+/g, '[^/]+')}$`
              );
              return routeRegex.test(cumulativePath.substring(1));
            }

            return false;
          });

          if (matchingRoute && matchingRoute.meta) {
            if (
              matchingRoute.meta.parent &&
              !crumbs.some(
                (crumb) => crumb.path === `/${matchingRoute.meta.parent}`
              )
            ) {
              const parentRoute = allFlattenedRoutes.find(
                (route) => route.path === matchingRoute.meta.parent
              );

              if (parentRoute && parentRoute.meta) {
                crumbs.push({
                  name: parentRoute.meta.breadcrumb,
                  path: `/${matchingRoute.meta.parent}`,
                });
              }
            }

            crumbs.push({
              name: matchingRoute.meta.breadcrumb,
              path: cumulativePath,
            });
          } else {
            crumbs.push({
              name:
                segment.charAt(0).toUpperCase() +
                segment.slice(1).replace(/-/g, ' '),
              path: cumulativePath,
            });
          }
        }
      }

      setBreadcrumbs(crumbs);
    };

    generateBreadcrumbs();
  }, [location]);

  const hideBreadcrumbs = location.pathname === '/';

  // Animation variants for breadcrumb items
  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <nav
      aria-label='Breadcrumb'
      className='relative py-3 px-4 sm:px-6'>
      {/* Subtle background pattern */}

      <div className='max-w-7xl mx-auto'>
        <ol className='flex flex-wrap items-center space-x-1 text-sm'>
          <motion.li
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='flex items-center'>
            <Link
              to='/'
              className='text-secondary-text hover:text-accent-blue transition-colors duration-200 flex items-center rounded-md px-2 py-1 hover:bg-secondary-bg/40'>
              <Home className='h-4 w-4' />
              <span className='pl-2 font-medium'>Home</span>
            </Link>
          </motion.li>

          {!hideBreadcrumbs &&
            breadcrumbs.slice(1).map((crumb, index) => (
              <motion.li
                key={index}
                custom={index}
                initial='hidden'
                animate='visible'
                variants={itemVariants}
                className='flex items-center'>
                <ChevronRight className='h-4 w-4 text-muted-text mx-1' />
                {index === breadcrumbs.length - 2 ? (
                  <motion.span className='font-medium text-primary-text bg-secondary-bg/40 px-3 py-1 rounded-md border border-secondary-bg/80'>
                    {crumb.name}
                  </motion.span>
                ) : (
                  <Link
                    to={crumb.path}
                    className='text-secondary-text hover:text-accent-blue transition-colors duration-200 px-2 py-1 rounded-md hover:bg-secondary-bg/40'>
                    {crumb.name}
                  </Link>
                )}
              </motion.li>
            ))}
        </ol>
      </div>
    </nav>
  );
};
