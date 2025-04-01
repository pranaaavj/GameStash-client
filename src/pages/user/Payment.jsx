import { useEffect, useState } from 'react';
import { Button } from '@/shadcn/components/ui/button';
import { Label } from '@/shadcn/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shadcn/components/ui/radio-group';
import { Alert, AlertDescription } from '@/shadcn/components/ui/alert';
import { Wallet, Smartphone, AlertCircle, Info } from 'lucide-react';
import { useUsers } from '@/hooks';
import { useGetCartQuery } from '@/redux/api/user/cartApi';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shadcn/components/ui/tooltip';

export default function PaymentSection({ onPaymentSelect }) {
  const user = useUsers();

  const [selectedMethod, setSelectedMethod] = useState('');
  const [isCodDisabled, setIsCodDisabled] = useState(false);
  const { data: responseCart } = useGetCartQuery(user?.userInfo?.id, {
    skip: !user?.userInfo?.id,
  });

  console.log(responseCart?.data?.total);
  useEffect(() => {
    if (responseCart?.data?.total >= 2000) {
      setIsCodDisabled(true);
    }
  }, [responseCart]);

  const handlePaymentSelection = (value) => {
    setSelectedMethod(value);
    onPaymentSelect(value);
  };

  return (
    <div className='space-y-6'>
      {/* Wallet Balance Section */}
      <div className='bg-secondary-bg/50 p-4 rounded-lg'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center space-x-2'>
            <Wallet className='w-5 h-5 text-accent-red' />
            <h3 className='font-medium'>Available Balance</h3>
          </div>
          <Button
            variant='link'
            className='text-accent-red p-0'>
            Add Money
          </Button>
        </div>
        <p className='text-secondary-text text-sm'>₹0.00 Available</p>
      </div>

      {/* Payment Methods */}
      <RadioGroup
        value={selectedMethod}
        onValueChange={handlePaymentSelection}>
        {/* UPI */}
        <div className='relative'>
          <RadioGroupItem
            value='UPI'
            id='UPI'
            className='peer sr-only'
          />
          <Label
            htmlFor='UPI'
            className='flex items-center justify-between p-4 bg-secondary-bg/50 rounded-lg cursor-pointer border border-transparent peer-data-[state=checked]:border-accent-red'>
            <div className='flex items-center space-x-3'>
              <Smartphone className='w-5 h-5' />
              <div>
                <p className='font-medium'>UPI Payment</p>
                <p className='text-sm text-secondary-text'>
                  Pay using any UPI app
                </p>
              </div>
            </div>
          </Label>
        </div>

        {/* Razorpay */}
        <div className='relative'>
          <RadioGroupItem
            value='Razorpay'
            id='Razorpay'
            className='peer sr-only'
          />
          <Label
            htmlFor='Razorpay'
            className='flex items-center justify-between p-4 bg-secondary-bg/50 rounded-lg cursor-pointer border border-transparent peer-data-[state=checked]:border-accent-red'>
            <div className='flex items-center space-x-3'>
              <Smartphone className='w-5 h-5' />
              <div>
                <p className='font-medium'>Razorpay</p>
                <p className='text-sm text-secondary-text'>
                  Pay using Razorpay
                </p>
              </div>
            </div>
          </Label>
        </div>

        {/* Cash on Delivery */}
        <div className='relative'>
          <RadioGroupItem
            value='Cash on Delivery'
            id='COD'
            className='peer sr-only'
            disabled={isCodDisabled}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Label
                htmlFor='COD'
                className={`flex items-center border-transparent justify-between p-4 bg-secondary-bg/50 rounded-lg cursor-pointer border ${
                  isCodDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'peer-data-[state=checked]:border-accent-red'
                }`}>
                <div className='flex items-center space-x-3'>
                  <Wallet className='w-5 h-5' />
                  <div>
                    <p className='font-medium'>Cash/Card on Delivery</p>
                    <p className='text-sm text-secondary-text'>
                      Pay when you receive your order
                    </p>
                  </div>
                </div>

                {/* Show Info Icon when COD is disabled */}
                {isCodDisabled && <Info className='w-5 h-5 text-gray-400' />}
              </Label>
            </TooltipTrigger>
            {/* Show reason for disabling COD */}
            {isCodDisabled && (
              <TooltipContent className='bg-accent-red/70 text-white p-2 text-sm rounded-md'>
                {'Cash on delivery is not available for orders above Rs 2000.'}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </RadioGroup>

      {/* Payment Security Notice */}
      <Alert className='bg-secondary-bg/50 border-accent-red/20'>
        <AlertCircle className='h-4 w-4 text-accent-red' />
        <AlertDescription className='text-sm text-secondary-text'>
          Your payment information is encrypted and secure. We never store your
          full card details.
        </AlertDescription>
      </Alert>
    </div>
  );
}
