export const validateOffer = (offer, isEditing = false) => {
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
    (Number(offer.discountValue) < 1 || Number(offer.discountValue) > 80)
  ) {
    errors.discountValue = 'Percentage discount must be between 1 and 80';
  }

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  if (!isEditing) {
    if (!offer.startDate) {
      errors.startDate = 'Offer start date is required';
    } else {
      const startDate = new Date(offer.startDate);
      startDate.setHours(0, 0, 0, 0);

      if (startDate < currentDate) {
        errors.startDate = 'Offer start date must be in the future';
      }
    }
  }

  if (!isEditing) {
    if (!offer.endDate) {
      errors.endDate = 'Offer end date is required';
    } else {
      const endDate = new Date(offer.endDate);
      endDate.setHours(0, 0, 0, 0);

      const startDate = new Date(offer.startDate);
      startDate.setHours(23, 59, 59, 999);

      if (endDate < currentDate) {
        errors.endDate = 'Offer end date must be in the future';
      } else if (startDate && endDate < startDate) {
        errors.endDate = 'Offer end date must be after the start date';
      }
    }
  }

  return errors;
};
