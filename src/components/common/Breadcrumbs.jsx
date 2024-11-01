import { useLocation, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shadcn/components/ui/breadcrumb';

export function Breadcrumbs() {
  const location = useLocation();

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("'/'").filter((x) => x);
    const breadcrumbs = [{ path: "'/'", label: "'Home'" }];

    pathnames.forEach((name, index) => {
      const path = `/${pathnames.slice(0, index + 1).join("'/'")}`;
      breadcrumbs.push({
        path,
        label: name.charAt(0).toUpperCase() + name.slice(1),
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Breadcrumb className='py-4 px-6'>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <BreadcrumbItem key={crumb.path}>
            {index < breadcrumbs.length - 1 ? (
              <BreadcrumbLink
                as={Link}
                to={crumb.path}>
                {index === 0 ? (
                  <Home
                    className='h-4 w-4'
                    aria-label='Home'
                  />
                ) : (
                  crumb.label
                )}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
            )}
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
