import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { CheckoutPage } from '@/pages/user/Checkout/CheckoutPage';

export const ProtectCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state?.isCheckoutAllowed) {
      // Redirect to home if the cart is empty
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  return <CheckoutPage />;
};
