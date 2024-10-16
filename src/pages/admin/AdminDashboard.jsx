import {
  Bell,
  // ChevronDown,
  // Home,
  LayoutDashboard,
  LineChart,
  Mail,
  Menu,
  PieChart,
  // Search,
  Table,
  Type,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shadcn/components/ui/avatar';
import { Button } from '@/shadcn/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shadcn/components/ui/card';
import { Input } from '@/shadcn/components/ui/input';

export const AdminDashboard = () => {
  return (
    <div className='min-h-screen bg-gray-900 text-gray-100'>
      {/* Sidebar */}
      <aside className='fixed inset-y-0 left-0 w-64 bg-gray-800 p-4 hidden lg:block'>
        <div className='flex items-center mb-8'>
          <PieChart className='h-8 w-8 text-red-500' />
          <span className='text-2xl font-bold ml-2 text-red-500'>DarkPan</span>
        </div>
        <nav className='space-y-2'>
          <Button
            variant='ghost'
            className='w-full justify-start'>
            <LayoutDashboard className='mr-2 h-4 w-4' />
            Dashboard
          </Button>
          <Button
            variant='ghost'
            className='w-full justify-start'>
            <Type className='mr-2 h-4 w-4' />
            Elements
          </Button>
          <Button
            variant='ghost'
            className='w-full justify-start'>
            <Table className='mr-2 h-4 w-4' />
            Tables
          </Button>
          <Button
            variant='ghost'
            className='w-full justify-start'>
            <LineChart className='mr-2 h-4 w-4' />
            Charts
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className='lg:ml-64 p-4'>
        {/* Top Bar */}
        <header className='flex justify-between items-center mb-6'>
          <Button
            variant='ghost'
            className='lg:hidden'>
            <Menu className='h-6 w-6' />
          </Button>
          <div className='flex-1 max-w-sm mx-4'>
            <Input
              type='search'
              placeholder='Search'
              className='bg-gray-800'
            />
          </div>
          <div className='flex items-center space-x-4'>
            <Button
              variant='ghost'
              size='icon'>
              <Mail className='h-5 w-5' />
            </Button>
            <Button
              variant='ghost'
              size='icon'>
              <Bell className='h-5 w-5' />
            </Button>
            <Avatar>
              <AvatarImage
                src='/placeholder-user.jpg'
                alt='@shadcn'
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          <Card className='bg-gray-800'>
            <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
              <CardTitle className='text-sm font-medium'>Today Sale</CardTitle>
              <LineChart className='h-4 w-4 text-red-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>$1234</div>
            </CardContent>
          </Card>
          <Card className='bg-gray-800'>
            <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
              <CardTitle className='text-sm font-medium'>Total Sale</CardTitle>
              <LineChart className='h-4 w-4 text-red-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>$1234</div>
            </CardContent>
          </Card>
          <Card className='bg-gray-800'>
            <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
              <CardTitle className='text-sm font-medium'>
                Today Revenue
              </CardTitle>
              <LineChart className='h-4 w-4 text-red-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>$1234</div>
            </CardContent>
          </Card>
          <Card className='bg-gray-800'>
            <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
              <CardTitle className='text-sm font-medium'>
                Total Revenue
              </CardTitle>
              <PieChart className='h-4 w-4 text-red-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>$1234</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6'>
          <Card className='bg-gray-800'>
            <CardHeader>
              <CardTitle>Worldwide Sales</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for chart */}
              <div className='h-[200px] bg-gray-700 rounded-md flex items-center justify-center'>
                Chart Placeholder
              </div>
            </CardContent>
          </Card>
          <Card className='bg-gray-800'>
            <CardHeader>
              <CardTitle>Sales & Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for chart */}
              <div className='h-[200px] bg-gray-700 rounded-md flex items-center justify-center'>
                Chart Placeholder
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sales Table */}
        <Card className='bg-gray-800'>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-gray-700'>
                    <th className='text-left p-2'>Date</th>
                    <th className='text-left p-2'>Invoice</th>
                    <th className='text-left p-2'>Customer</th>
                    <th className='text-left p-2'>Amount</th>
                    <th className='text-left p-2'>Status</th>
                    <th className='text-left p-2'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4].map((i) => (
                    <tr
                      key={i}
                      className='border-b border-gray-700'>
                      <td className='p-2'>01 Jan 2045</td>
                      <td className='p-2'>INV-0123</td>
                      <td className='p-2'>John Doe</td>
                      <td className='p-2'>$123</td>
                      <td className='p-2'>Paid</td>
                      <td className='p-2'>
                        <Button
                          size='sm'
                          className='bg-red-500 hover:bg-red-600'>
                          Detail
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
