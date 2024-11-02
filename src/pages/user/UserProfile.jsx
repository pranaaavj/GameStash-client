'use client';

import { useState } from 'react';
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

export default function UserProfilePage() {
  return (
    <div className='min-h-screen bg-primary-bg text-primary-text p-4 sm:p-6 lg:p-8'>
      <h1 className='text-3xl font-poppins font-bold mb-6'>User Profile</h1>
      <Tabs
        defaultValue='profile'
        className='w-full '>
        <TabsList className='grid w-full grid-cols-4 bg-accent-blue'>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='password'>Password</TabsTrigger>
          <TabsTrigger value='address'>Address</TabsTrigger>
          <TabsTrigger value='orders'>Orders</TabsTrigger>
        </TabsList>
        <TabsContent value='profile'>
          <ProfileView />
        </TabsContent>
        <TabsContent value='password'>
          <ChangePassword />
        </TabsContent>
        <TabsContent value='address'>
          <AddAddress />
        </TabsContent>
        <TabsContent value='orders'>
          <OrderHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileView() {
  return (
    <Card className='bg-secondary-bg text-primary-text border-none'>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>View and edit your profile details</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center space-x-4'>
          <Avatar className='h-20 w-20'>
            <AvatarImage
              src='/placeholder.svg'
              alt='Profile picture'
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h2 className='text-xl font-semibold'>John Doe</h2>
            <p className='text-muted-foreground'>john.doe@example.com</p>
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='username'>Username</Label>
          <Input
            id='username'
            value='johndoe'
            readOnly
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            value='john.doe@example.com'
            readOnly
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className='bg-accent-blue hover:bg-hover-blue text-white'>
          Edit Profile
        </Button>
      </CardFooter>
    </Card>
  );
}

function ChangePassword() {
  return (
    <Card className='bg-secondary text-secondary-foreground'>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password securely</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='current-password'>Current Password</Label>
          <Input
            id='current-password'
            type='password'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='new-password'>New Password</Label>
          <Input
            id='new-password'
            type='password'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='confirm-password'>Confirm New Password</Label>
          <Input
            id='confirm-password'
            type='password'
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className='bg-accent-blue hover:bg-hover-blue text-white'>
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}

function AddAddress() {
  const [addresses, setAddresses] = useState([]);

  const handleAddAddress = () => {
    setAddresses([...addresses, { id: addresses.length + 1 }]);
  };

  return (
    <Card className='bg-secondary text-secondary-foreground'>
      <CardHeader>
        <CardTitle>Manage Addresses</CardTitle>
        <CardDescription>Add or edit your shipping addresses</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {addresses.map((address) => (
          <Collapsible key={address.id}>
            <CollapsibleTrigger asChild>
              <Button
                variant='outline'
                className='w-full justify-between'>
                Address {address.id}
                <span className='sr-only'>Toggle</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className='space-y-2 mt-2'>
              <Input placeholder='Address Line 1' />
              <Input placeholder='Address Line 2 (optional)' />
              <div className='grid grid-cols-2 gap-2'>
                <Input placeholder='City' />
                <Input placeholder='State/Province' />
              </div>
              <div className='grid grid-cols-2 gap-2'>
                <Input placeholder='Postal Code' />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Country' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='us'>United States</SelectItem>
                    <SelectItem value='ca'>Canada</SelectItem>
                    <SelectItem value='uk'>United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAddAddress}
          className='bg-accent-green hover:bg-hover-green text-white'>
          Add New Address
        </Button>
      </CardFooter>
    </Card>
  );
}

function OrderHistory() {
  const orders = [
    { id: '1234', date: '2023-05-01', status: 'Delivered', total: '$129.99' },
    { id: '5678', date: '2023-06-15', status: 'Shipped', total: '$79.99' },
    { id: '9012', date: '2023-07-20', status: 'Processing', total: '$199.99' },
  ];

  return (
    <Card className='bg-secondary text-secondary-foreground'>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>
          View your past orders and their details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {orders.map((order) => (
            <Card
              key={order.id}
              className='bg-primary text-primary-foreground'>
              <CardHeader>
                <CardTitle>Order #{order.id}</CardTitle>
                <CardDescription>{order.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Status: {order.status}</p>
                <p>Total: {order.total}</p>
              </CardContent>
              <CardFooter>
                <Button variant='outline'>Order Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
