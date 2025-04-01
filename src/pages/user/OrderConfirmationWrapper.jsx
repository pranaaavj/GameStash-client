import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OrderConfirmation } from './OrderConfirm';
import { PaymentFailedConfirmation } from './PaymentFailed';

export const OrderConfirmationWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('success');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status =
      params.get('status') || location.state?.paymentStatus || 'success';
    const orderId = params.get('orderId') || location.state?.orderId;

    if (!orderId) {
      navigate('/orders');
    }

    setPaymentStatus(status);
  }, [location, navigate]);

  return paymentStatus === 'failed' ? (
    <PaymentFailedConfirmation />
  ) : (
    <OrderConfirmation />
  );
};
