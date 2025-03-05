export const validateOffer = (offer) => {
  const errors = {};

  if (!offer.name.trim()) {
    errors.name = 'Offer name is required';
  }

  if (!offer.type) {
    errors.type = 'Offer type is required';
  }

  if (!offer.discountType) {
    errors.discountType = 'Discount type is required';
  }

  if (!offer.discountValue) {
    errors.discountValue = 'Discount value is required';
  } else if (isNaN(offer.discountValue) || Number(offer.discountValue) <= 0) {
    errors.discountValue = 'Discount value must be a positive number';
  } else if (
    offer.discountType === 'percentage' &&
    (Number(offer.discountValue) < 1 || Number(offer.discountValue) > 100)
  ) {
    errors.discountValue = 'Percentage discount must be between 1 and 100';
  }

  if (!offer.expirationDate) {
    errors.expirationDate = 'Expiration date is required';
  } else {
    const currentDate = new Date();
    const expirationDate = new Date(offer.expirationDate);
    if (expirationDate < currentDate) {
      errors.expirationDate = 'Expiration date must be in the future';
    }
  }

  return errors;
};
