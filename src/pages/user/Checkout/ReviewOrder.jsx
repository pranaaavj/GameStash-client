/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Button } from '@/shadcn/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/shadcn/components/ui/radio-group';
import { Checkbox } from '@/shadcn/components/ui/checkbox';
import { Label } from '@/shadcn/components/ui/label';
import { Alert, AlertDescription } from '@/shadcn/components/ui/alert';
import { Package, Truck, Clock, AlertCircle } from 'lucide-react';

export default function ReviewOrder({ onComplete }) {
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [subscribeAndSave, setSubscribeAndSave] = useState(false);

  const handleDeliverySelection = (value) => {
    setSelectedDelivery(value);
    onComplete(true);
  };

  const cartItems = [
    {
      id: 1,
      name: 'Gaming Headset Pro X',
      price: 129.99,
      image: '/placeholder.svg',
      quantity: 1,
    },
  ];

  const deliveryOptions = [
    {
      id: 'express',
      label: 'Express Delivery',
      price: 9.99,
      date: 'Tomorrow, Nov 10',
      time: 'by 8 PM',
    },
    {
      id: 'standard',
      label: 'Standard Delivery',
      price: 4.99,
      date: 'Monday, Nov 13',
      time: 'by 8 PM',
    },
    {
      id: 'free',
      label: 'Free Delivery',
      price: 0,
      date: 'Wednesday, Nov 15',
      time: 'by 8 PM',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Delivery Options */}
      <div className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <Truck className='w-5 h-5 text-accent-red' />
          <h3 className='font-medium'>Choose your delivery option</h3>
        </div>
        <RadioGroup
          value={selectedDelivery}
          onValueChange={handleDeliverySelection}>
          {deliveryOptions.map((option) => (
            <div
              key={option.id}
              className='relative'>
              <RadioGroupItem
                value={option.id}
                id={`delivery-${option.id}`}
                className='peer sr-only'
              />
              <Label
                htmlFor={`delivery-${option.id}`}
                className='flex items-center justify-between p-4 bg-secondary-bg/50 rounded-lg cursor-pointer border border-transparent peer-data-[state=checked]:border-accent-red'>
                <div className='flex-1'>
                  <p className='font-medium'>{option.label}</p>
                  <p className='text-sm text-secondary-text'>
                    {option.date} {option.time}
                  </p>
                </div>
                <span className='text-accent-red font-semibold ml-4'>
                  {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Order Items */}
      <div className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <Package className='w-5 h-5 text-accent-red' />
          <h3 className='font-medium'>Review your items</h3>
        </div>
        {cartItems.map((item) => (
          <div
            key={item.id}
            className='flex items-center space-x-4 bg-secondary-bg/50 p-4 rounded-lg'>
            <img
              src={item.image}
              alt={item.name}
              className='w-16 h-16 object-cover rounded-md'
            />
            <div className='flex-1'>
              <h4 className='font-medium'>{item.name}</h4>
              <p className='text-sm text-secondary-text'>
                Quantity: {item.quantity}
              </p>
              <p className='font-semibold'>${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Subscribe & Save */}
      <div className='bg-secondary-bg/50 p-4 rounded-lg space-y-4'>
        <div className='flex items-center space-x-2'>
          <Clock className='w-5 h-5 text-accent-red' />
          <h3 className='font-medium'>Subscribe & Save</h3>
        </div>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='subscribe'
            checked={subscribeAndSave}
            onCheckedChange={setSubscribeAndSave}
          />
          <div className='grid gap-1.5 leading-none'>
            <Label
              htmlFor='subscribe'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
              Auto-deliver every:
            </Label>
            <p className='text-sm text-secondary-text'>
              2 months (most common)
            </p>
          </div>
        </div>
        {subscribeAndSave && (
          <Alert className='bg-accent-red/10 border-accent-red/20'>
            <AlertCircle className='h-4 w-4 text-accent-red' />
            <AlertDescription className='text-sm text-accent-red'>
              Save 5% now and up to 10% on future auto-deliveries.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Delivery Instructions */}
      <div className='bg-secondary-bg/50 p-4 rounded-lg space-y-2'>
        <h3 className='font-medium'>Delivery Instructions</h3>
        <p className='text-sm text-secondary-text'>
          Add any special instructions for your delivery.
        </p>
        <Button
          variant='outline'
          className='w-full justify-start text-accent-red'>
          Add delivery instructions
        </Button>
      </div>

      {/* Order Policies */}
      <Alert className='bg-secondary-bg/50 border-accent-red/20'>
        <AlertCircle className='h-4 w-4 text-accent-red' />
        <AlertDescription className='text-sm text-secondary-text'>
          By placing your order, you agree to our privacy notice and conditions
          of use.
        </AlertDescription>
      </Alert>
    </div>
  );
}
