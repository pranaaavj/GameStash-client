import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Check, AlertCircle } from 'lucide-react';
import { useApplyReferralMutation } from '@/redux/api/user/referralApi';

export const ReferralButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className='flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] text-[#e5e5e5] px-4 py-2 rounded-lg transition-colors'>
        <Gift className='w-4 h-4 text-accent-red' />
        <span>Got a referral code?</span>
      </motion.button>

      <ReferralModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export const ReferralModal = ({ isOpen, onClose }) => {
  const [referralCode, setReferralCode] = useState('');
  const [applyReferral, { isLoading }] = useApplyReferralMutation();
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!referralCode.trim()) {
      setStatus({
        type: 'error',
        message: 'Please enter a referral code',
      });
      return;
    }

    try {
      const response = await applyReferral({ referralCode }).unwrap();
      setStatus({
        type: 'success',
        message: response.message || 'Referral code applied successfully!',
      });

      setTimeout(() => {
        onClose();
        setReferralCode('');
        setStatus({ type: '', message: '' });
      }, 2000);
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error?.data?.message ||
          'Failed to apply referral code. Please try again.',
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4'
          onClick={onClose}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className='bg-[#1a1a1a] rounded-xl p-6 max-w-md w-full shadow-xl'
            onClick={(e) => e.stopPropagation()}>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-bold text-[#e5e5e5] flex items-center gap-2'>
                <Gift className='w-5 h-5 text-accent-red' />
                Apply Referral Code
              </h2>
              <button
                onClick={onClose}
                className='text-[#999] hover:text-[#e5e5e5] transition-colors'>
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='mb-6'>
              <p className='text-[#999] mb-2'>
                Enter a friend referral code to get ₹100 in your wallet. Your
                friend will receive ₹300!
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <input
                  type='text'
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder='Enter referral code'
                  className='w-full bg-[#252525] border border-[#333] rounded-lg px-4 py-3 text-[#e5e5e5] placeholder-[#666] focus:outline-none focus:border-accent-red transition-colors'
                  disabled={isLoading}
                />
              </div>

              {status.message && (
                <div
                  className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${
                    status.type === 'error'
                      ? 'bg-accent-red/10 text-accent-red'
                      : 'bg-green-500/10 text-green-500'
                  }`}>
                  {status.type === 'error' ? (
                    <AlertCircle className='w-5 h-5 flex-shrink-0 mt-0.5' />
                  ) : (
                    <Check className='w-5 h-5 flex-shrink-0 mt-0.5' />
                  )}
                  <span className='text-sm'>{status.message}</span>
                </div>
              )}

              <button
                type='submit'
                disabled={isLoading}
                className={`w-full bg-accent-red hover:bg-[#ff3333] text-white font-medium py-3 rounded-lg transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}>
                {isLoading ? 'Applying...' : 'Apply Code'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
