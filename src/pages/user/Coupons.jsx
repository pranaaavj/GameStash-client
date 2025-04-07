import { useState, useRef } from 'react';

import { Button } from '@/shadcn/components/ui/button';
import { Label } from '@/shadcn/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shadcn/components/ui/radio-group';
import { Alert, AlertDescription } from '@/shadcn/components/ui/alert';
import { Percent, AlertCircle, Check, Copy, X } from 'lucide-react';
import { useGetEligibleCouponsQuery } from '@/redux/api/user/couponApi';
import { Input } from '@/shadcn/components/ui/input';

import { showToast, handleApiError } from '@/utils';

export const Coupons = ({ onCouponSelect }) => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const [validationError, setValidationError] = useState('');
  const [validationSuccess, setValidationSuccess] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const inputRef = useRef(null);
  const { data: couponsData, isLoading } = useGetEligibleCouponsQuery();

  const coupons = couponsData?.data || [];

  const handleCouponSelection = (coupon) => {
    if (selectedCoupon?.code === coupon.code) {
      setSelectedCoupon(null);
      setAppliedCoupon(null);
      onCouponSelect(null);
    } else {
      setSelectedCoupon(coupon);
      setManualCode('');
      setValidationError('');
      setValidationSuccess('');
    }
  };

  const handleManualCodeChange = (e) => {
    setManualCode(e.target.value);
    setValidationError('');
    setValidationSuccess('');
    setSelectedCoupon(null);
  };

  const validateCouponCode = () => {
    if (!manualCode.trim()) {
      setValidationError('Please enter a coupon code');
      return;
    }

    const coupon = coupons.find(
      (c) => c.code.toLowerCase() === manualCode.trim().toLowerCase()
    );

    if (coupon) {
      setSelectedCoupon(coupon);
      setValidationSuccess(
        `Valid coupon: ${coupon.discountValue}${
          coupon.discountType === 'percentage' ? '%' : '₹'
        } off`
      );
      setValidationError('');
    } else {
      setValidationError('Invalid coupon code');
      setSelectedCoupon(null);
      setValidationSuccess('');
    }
  };

  const applyCoupon = () => {
    if (selectedCoupon) {
      setAppliedCoupon(selectedCoupon);
      onCouponSelect(selectedCoupon);
      showToast.success(`Coupon ${selectedCoupon.code} applied successfully!`);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setSelectedCoupon(null);
    setManualCode('');
    setValidationError('');
    setValidationSuccess('');
    onCouponSelect(null);
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code).then(
      () => {
        showToast.success('Coupon code copied to clipboard!');
        setManualCode(code);
        inputRef.current?.focus();
      },
      () => {
        handleApiError(new Error('Failed to copy coupon code'));
      }
    );
  };

  const proceedWithoutCoupon = () => {
    setAppliedCoupon(null);
    setSelectedCoupon(null);
    setManualCode('');
    setValidationError('');
    setValidationSuccess('');
    onCouponSelect(null);
    showToast.info('Proceeding without a coupon');
  };

  return (
    <div className='space-y-6'>
      {/* Manual Coupon Entry */}
      <div className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <Percent className='w-5 h-5 text-accent-red' />
          <h3 className='font-medium'>Enter Coupon Code</h3>
        </div>

        <div className='flex flex-col space-y-3'>
          <div className='flex space-x-2'>
            <Input
              ref={inputRef}
              type='text'
              placeholder='Enter coupon code'
              value={manualCode}
              onChange={handleManualCodeChange}
              className='bg-secondary-bg text-primary-text'
            />

            <Button
              onClick={validateCouponCode}
              className='bg-accent-blue hover:bg-hover-blue whitespace-nowrap'>
              Check Code
            </Button>
          </div>

          {validationError && (
            <p className='text-accent-red text-sm flex items-center'>
              <X className='h-4 w-4 mr-1' />
              {validationError}
            </p>
          )}

          {validationSuccess && (
            <p className='text-green-500 text-sm flex items-center'>
              <Check className='h-4 w-4 mr-1' />
              {validationSuccess}
            </p>
          )}

          <div className='flex space-x-2 pt-1'>
            {selectedCoupon && !appliedCoupon && (
              <Button
                onClick={applyCoupon}
                className='bg-accent-blue hover:bg-hover-blue'>
                Apply Coupon
              </Button>
            )}

            {appliedCoupon && (
              <Button
                onClick={removeCoupon}
                className='bg-gray-600 text-white hover:bg-gray-700'>
                Remove Coupon
              </Button>
            )}

            <Button
              onClick={proceedWithoutCoupon}
              variant='outline'
              className='bg-accent-blue border-none hover:bg-hover-blue hover:text-white'>
              No Coupon
            </Button>
          </div>
        </div>
      </div>

      {/* Available Coupons Section */}
      <div className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <Percent className='w-5 h-5 text-accent-red' />
          <h3 className='font-medium'>Available Coupons</h3>
        </div>

        {isLoading ? (
          <p>Loading coupons...</p>
        ) : (
          <RadioGroup
            value={selectedCoupon?.code || ''}
            onValueChange={(code) => {
              const coupon = coupons.find((c) => c.code === code);
              handleCouponSelection(coupon);
            }}>
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className='relative'>
                <RadioGroupItem
                  value={coupon.code}
                  id={`coupon-${coupon.code}`}
                  className='peer sr-only'
                />
                <Label
                  htmlFor={`coupon-${coupon.code}`}
                  className='flex items-center justify-between p-4 bg-secondary-bg/50 rounded-lg cursor-pointer border border-transparent peer-data-[state=checked]:border-accent-red'>
                  <div className='flex-1'>
                    <p className='font-medium'>{coupon.code}</p>
                    <p className='text-sm text-secondary-text'>
                      {coupon.discountValue}
                      {coupon.discountType === 'percentage' ? '%' : '₹'} off
                      (Min Order: ₹{coupon.minOrderAmount})
                    </p>
                  </div>

                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      copyToClipboard(coupon.code);
                    }}
                    className='text-secondary-text hover:text-primary-text'>
                    <Copy className='h-4 w-4' />
                  </Button>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      {/* Show Applied Coupon Alert */}
      {appliedCoupon && (
        <Alert className='bg-accent-red/10 border-accent-red/20'>
          <Check className='h-4 w-4 text-accent-red' />
          <AlertDescription className='text-sm text-accent-red'>
            Coupon {appliedCoupon.code} applied! You get{' '}
            {appliedCoupon.discountValue}
            {appliedCoupon.discountType === 'percentage' ? '%' : '₹'} off.
          </AlertDescription>
        </Alert>
      )}

      {/* Offer Terms */}
      <Alert className='bg-secondary-bg/50 border-accent-red/20'>
        <AlertCircle className='h-4 w-4 text-accent-red' />
        <AlertDescription className='text-sm text-secondary-text'>
          Coupons cannot be combined. The best available offer will be applied
          at checkout.
        </AlertDescription>
      </Alert>
    </div>
  );
};
