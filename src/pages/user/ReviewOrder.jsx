import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/shadcn/components/ui/radio-group';
import { Label } from '@/shadcn/components/ui/label';
import { Alert, AlertDescription } from '@/shadcn/components/ui/alert';
import { Truck, Package, AlertCircle } from 'lucide-react';

export const ReviewOrder = ({ onDeliverySelect, cartItems }) => {
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const handleDeliverySelection = (value) => {
    const selectedOption = deliveryOptions.find(
      (option) => option.id === value
    );
    setSelectedDelivery(value);
    onDeliverySelect(selectedOption);
  };

  const deliveryOptions = [
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
                  {/* <p className='text-sm text-secondary-text'>
                    {option.date} {option.time}
                  </p> */}
                </div>
                {/* <span className='text-accent-red font-semibold ml-4'>
                  {option.price === 0 ? 'FREE' : `₹${option.price.toFixed(2)}`}
                </span> */}
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
        {cartItems &&
          cartItems.map((item) => (
            <div
              key={item?.product?._id}
              className='flex items-center space-x-4 bg-secondary-bg/50 p-4 rounded-lg'>
              <img
                src={item?.product?.images?.[0]}
                alt={item?.product?.name}
                className='w-16 h-16 object-cover rounded-md'
              />
              <div className='flex-1'>
                <h4 className='font-medium'>{item?.product.name}</h4>
                <p className='text-sm text-secondary-text'>
                  Quantity: {item?.quantity}
                </p>
                <p className='font-semibold'>
                  ₹{item?.product?.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Order Policies */}
      <Alert className='bg-secondary-bg/50 border-accent-red/20 flex items-center'>
        <div className='flex items-center space-x-2'>
          <AlertCircle className='h-5 w-5 text-accent-red' />
          <AlertDescription className='text-sm text-secondary-text'>
            By placing your order, you agree to our privacy notice and
            conditions of use.
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
};
