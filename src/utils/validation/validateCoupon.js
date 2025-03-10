export const validateCoupon = (couponData, isEditing = false) => {
  const errors = {};

  const discountValue = Number(couponData.discountValue);
  const minOrderAmount = Number(couponData.minOrderAmount);
  const maxDiscountAmount = Number(couponData.maxDiscountAmount);
  const usageLimit = Number(couponData.usageLimit);
  const perUserLimit = Number(couponData.perUserLimit);

  if (!couponData.code) {
    errors.code = 'Coupon code is required';
  } else if (couponData.code.length < 3) {
    errors.code = 'Coupon code must be at least 3 characters';
  }

  if (!couponData.discountType) {
    errors.discountType = 'Discount type is required';
  } else if (!['percentage', 'amount'].includes(couponData.discountType)) {
    errors.discountType = 'Invalid discount type';
  }

  if (!couponData.discountValue) {
    errors.discountValue = 'Discount value is required';
  } else if (isNaN(discountValue) || discountValue <= 0) {
    errors.discountValue = 'Discount value must be greater than 0';
  } else if (
    couponData.discountType === 'percentage' &&
    (discountValue < 1 || discountValue > 80)
  ) {
    errors.discountValue = 'Percentage discount should be between 1% and 80%.';
  } else if (
    couponData.discountType === 'amount' &&
    discountValue > minOrderAmount
  ) {
    errors.discountValue =
      'Discount value cannot exceed the minimum order amount.';
  }

  if (isNaN(minOrderAmount) || minOrderAmount < 0) {
    errors.minOrderAmount = 'Minimum order amount cannot be negative';
  }

  if (couponData.discountType === 'percentage') {
    if (!couponData.maxDiscountAmount) {
      errors.maxDiscountAmount =
        'Maximum discount is required for percentage-based coupons';
    } else if (isNaN(maxDiscountAmount) || maxDiscountAmount <= 0) {
      errors.maxDiscountAmount =
        'Maximum discount amount must be greater than 0';
    }
  } else {
    delete errors.maxDiscountAmount;
  }

  if (!couponData.usageLimit) {
    errors.usageLimit = 'Usage limit is required';
  } else if (isNaN(usageLimit) || usageLimit <= 0) {
    errors.usageLimit = 'Usage limit must be a positive integer';
  }

  if (!couponData.perUserLimit) {
    errors.perUserLimit = 'Per-user limit is required';
  } else if (isNaN(perUserLimit) || perUserLimit <= 0) {
    errors.perUserLimit = 'Per-user limit must be a positive integer';
  } else if (perUserLimit > usageLimit) {
    errors.perUserLimit = 'Per-user limit cannot exceed the total usage limit.';
  }

  if (!isEditing) {
    if (!couponData.startDate) {
      errors.startDate = 'Start date is required';
    } else if (
      new Date(couponData.startDate) < new Date().setHours(0, 0, 0, 0)
    ) {
      errors.startDate = 'Start date must be today or in the future';
    }
  }

  if (!isEditing) {
    if (!couponData.endDate) {
      errors.endDate = 'End date is required';
    } else if (
      couponData.startDate &&
      couponData.endDate &&
      new Date(couponData.endDate) <= new Date(couponData.startDate)
    ) {
      errors.endDate = 'End date must be after start date';
    }
  }

  return errors;
};
