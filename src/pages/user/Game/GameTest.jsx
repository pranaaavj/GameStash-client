/* eslint-disable react/prop-types */

import { ReferralModal } from '@/components/user';
import { Button } from '@/shadcn/components/ui/button';
import { useState } from 'react';

export function Test() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleApplyReferralCode = async (code) => {
    // Simulate API call
    console.log('Applying referral code:', code);

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate validation
    if (code === 'INVALID') {
      throw new Error('Invalid referral code');
    }

    // Success case
    return true;
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] p-4 bg-primary-bg text-primary-text'>
      <h1 className='text-2xl font-bold mb-6'>Referral Code Demo</h1>

      <Button
        onClick={handleOpenModal}
        className='bg-accent-blue hover:bg-hover-blue text-white'>
        Enter Referral Code
      </Button>

      <ReferralModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApply={handleApplyReferralCode}
      />

      <p className='mt-4 text-sm text-gray-400'>
        Try entering INVALID to see error handling
      </p>
    </div>
  );
}
