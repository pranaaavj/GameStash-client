import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export const ReferralModal = ({
  isOpen,
  onClose,
  onApply,
  title = 'Enter Referral Code',
  description = 'If you have a referral code, enter it below to receive special benefits.',
  cancelText = "No, I don't have a code",
  applyText = 'Apply Code',
}) => {
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setReferralCode('');
      setError('');
      setSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle input change
  const handleInputChange = (e) => {
    setReferralCode(e.target.value);
    if (error) setError('');
    if (success) setSuccess(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!referralCode.trim()) {
      setError('Please enter a referral code');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // Call the onApply function passed as prop
      await onApply(referralCode);

      setSuccess(true);
      setIsSubmitting(false);

      // Close modal after success (with a small delay for feedback)
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to apply referral code');
    }
  };

  // Handle click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'
          initial='hidden'
          animate='visible'
          exit='hidden'
          variants={overlayVariants}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}>
          <motion.div
            className='w-full max-w-md rounded-xl bg-primary-bg text-primary-text shadow-xl'
            variants={modalVariants}
            transition={{ duration: 0.3, type: 'spring', damping: 25 }}>
            {/* Modal Header */}
            <div className='flex items-center justify-between border-b border-gray-700 p-5'>
              <h2 className='text-xl font-bold'>{title}</h2>
              <button
                onClick={onClose}
                className='rounded-full p-1 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors'
                aria-label='Close'>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div className='p-5'>
                <p className='mb-4 text-gray-300'>{description}</p>

                <div className='space-y-3'>
                  <label
                    htmlFor='referralCode'
                    className='block text-sm font-medium text-gray-300'>
                    Referral Code
                  </label>
                  <div className='relative'>
                    <input
                      type='text'
                      id='referralCode'
                      value={referralCode}
                      onChange={handleInputChange}
                      placeholder='Enter your referral code'
                      className={`w-full rounded-md border ${
                        error
                          ? 'border-accent-red'
                          : success
                          ? 'border-green-500'
                          : 'border-gray-600'
                      } bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue`}
                      disabled={isSubmitting || success}
                    />
                    {success && (
                      <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                        <CheckCircle className='h-5 w-5 text-green-500' />
                      </div>
                    )}
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className='flex items-center text-accent-red text-sm'>
                      <AlertCircle className='mr-1 h-4 w-4' />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Success message */}
                  {success && (
                    <div className='flex items-center text-green-500 text-sm'>
                      <CheckCircle className='mr-1 h-4 w-4' />
                      <span>Referral code applied successfully!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className='flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-2 border-t border-gray-700 p-5'>
                <button
                  type='button'
                  onClick={onClose}
                  className='rounded-md border border-gray-600 bg-transparent px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500'
                  disabled={isSubmitting}>
                  {cancelText}
                </button>
                <motion.button
                  type='submit'
                  className='rounded-md bg-accent-blue px-4 py-2 text-white hover:bg-hover-blue transition-colors focus:outline-none focus:ring-2 focus:ring-accent-blue disabled:opacity-50 disabled:cursor-not-allowed'
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting || success}>
                  {isSubmitting ? (
                    <div className='flex items-center justify-center'>
                      <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                      <span className='ml-2'>Processing...</span>
                    </div>
                  ) : (
                    applyText
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
