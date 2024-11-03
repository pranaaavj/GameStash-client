import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shadcn/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shadcn/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shadcn/components/ui/avatar';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shadcn/components/ui/collapsible';
import { User, Lock, MapPin, ShoppingBag, ChevronRight } from 'lucide-react';
import ProfileView from './Profile/ProfileView';

export default function UserProfilePage() {
  return (
    <div className='min-h-screen bg-primary-bg text-primary-text p-4 sm:p-6 lg:p-8'>
      <div className='max-w-6xl mx-auto space-y-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-4xl font-bold'>Account Settings</h1>
          <div className='flex items-center space-x-4'>
            <Avatar className='h-10 w-10'>
              <AvatarImage src='/placeholder.svg' />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className='text-right'>
              <p className='text-sm font-medium'>John Doe</p>
              <p className='text-xs text-secondary-text'>Premium Member</p>
            </div>
          </div>
        </div>

        <Tabs
          defaultValue='profile'
          className='w-full'>
          <TabsList className='w-full grid grid-cols-4 gap-4 bg-transparent p-0 mb-20'>
            {[
              { value: 'profile', label: 'Profile', icon: User },
              { value: 'password', label: 'Password', icon: Lock },
              { value: 'address', label: 'Address', icon: MapPin },
              { value: 'orders', label: 'Orders', icon: ShoppingBag },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className='data-[state=active]:bg-secondary-bg data-[state=active]:text-primary-text bg-primary-bg/50 border-none shadow-none h-24 flex flex-col items-center justify-center gap-2'>
                <Icon className='h-6 w-6' />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='profile'>
            <ProfileView />
          </TabsContent>

          <TabsContent value='password'>
            <Card className='bg-gradient-to-br from-primary-bg to-secondary-bg border-none shadow-lg'>
              <CardHeader>
                <CardTitle className='text-2xl'>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-2'>
                  <Label>Current Password</Label>
                  <Input
                    type='password'
                    className='bg-primary-bg/50 border-none'
                  />
                </div>
                <div className='space-y-2'>
                  <Label>New Password</Label>
                  <Input
                    type='password'
                    className='bg-primary-bg/50 border-none'
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Confirm New Password</Label>
                  <Input
                    type='password'
                    className='bg-primary-bg/50 border-none'
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className='bg-accent-blue hover:bg-hover-blue text-white ml-auto'>
                  Update Password
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value='address'>
            <Card className='bg-gradient-to-br from-primary-bg to-secondary-bg border-none shadow-lg'>
              <CardHeader>
                <CardTitle className='text-2xl'>Shipping Addresses</CardTitle>
                <CardDescription>
                  Manage your shipping addresses
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                {[1, 2].map((id) => (
                  <Collapsible key={id}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant='outline'
                        className='w-full justify-between bg-primary-bg/50 border-none hover:bg-secondary-bg'>
                        Address {id}
                        <ChevronRight className='h-4 w-4' />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className='space-y-4 mt-4 p-4 bg-primary-bg/30 rounded-lg'>
                      <Input
                        placeholder='Address Line 1'
                        className='bg-primary-bg/50 border-none'
                      />
                      <Input
                        placeholder='Address Line 2'
                        className='bg-primary-bg/50 border-none'
                      />
                      <div className='grid grid-cols-2 gap-4'>
                        <Input
                          placeholder='City'
                          className='bg-primary-bg/50 border-none'
                        />
                        <Input
                          placeholder='State'
                          className='bg-primary-bg/50 border-none'
                        />
                      </div>
                      <div className='grid grid-cols-2 gap-4'>
                        <Input
                          placeholder='ZIP Code'
                          className='bg-primary-bg/50 border-none'
                        />
                        <Select>
                          <SelectTrigger className='bg-primary-bg/50 border-none'>
                            <SelectValue placeholder='Country' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='us'>United States</SelectItem>
                            <SelectItem value='uk'>United Kingdom</SelectItem>
                            <SelectItem value='ca'>Canada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
              <CardFooter>
                <Button className='bg-accent-blue hover:bg-hover-blue text-white ml-auto'>
                  Add New Address
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value='orders'>
            <Card className='bg-gradient-to-br from-primary-bg to-secondary-bg border-none shadow-lg'>
              <CardHeader>
                <CardTitle className='text-2xl'>Order History</CardTitle>
                <CardDescription>View and manage your orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {[
                    {
                      id: 'ORD001',
                      date: 'Oct 28, 2023',
                      status: 'Delivered',
                      total: '$129.99',
                    },
                    {
                      id: 'ORD002',
                      date: 'Oct 15, 2023',
                      status: 'Shipped',
                      total: '$79.99',
                    },
                    {
                      id: 'ORD003',
                      date: 'Oct 02, 2023',
                      status: 'Processing',
                      total: '$199.99',
                    },
                  ].map((order) => (
                    <Card
                      key={order.id}
                      className='bg-primary-bg/50 border-none'>
                      <CardHeader>
                        <CardTitle className='text-lg'>{order.id}</CardTitle>
                        <CardDescription>{order.date}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className='space-y-2'>
                          <div className='flex justify-between'>
                            <span className='text-secondary-text'>Status</span>
                            <span>{order.status}</span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-secondary-text'>Total</span>
                            <span>{order.total}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant='outline'
                          className='w-full bg-primary-bg/50 hover:bg-secondary-bg border-none'>
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
