export const validateCoupon = (couponData) => {
  const errors = {};

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
  } else if (couponData.discountValue <= 0) {
    errors.discountValue = 'Discount value must be greater than 0';
  } else if (
    couponData.discountType === 'percentage' &&
    couponData.discountValue > 100
  ) {
    errors.discountValue = 'Percentage discount cannot exceed 100%';
  }

  if (couponData.minOrderAmount < 0) {
    errors.minOrderAmount = 'Minimum order amount cannot be negative';
  }

  if (
    couponData.maxDiscountAmount !== null &&
    couponData.maxDiscountAmount <= 0
  ) {
    errors.maxDiscountAmount = 'Maximum discount amount must be greater than 0';
  }

  if (!couponData.usageLimit) {
    errors.usageLimit = 'Usage limit is required';
  } else if (
    couponData.usageLimit <= 0 ||
    !Number.isInteger(couponData.usageLimit)
  ) {
    errors.usageLimit = 'Usage limit must be a positive integer';
  }

  if (!couponData.perUserLimit) {
    errors.perUserLimit = 'Per-user limit is required';
  } else if (
    couponData.perUserLimit <= 0 ||
    !Number.isInteger(couponData.perUserLimit)
  ) {
    errors.perUserLimit = 'Per-user limit must be a positive integer';
  }

  if (!couponData.startDate) {
    errors.startDate = 'Start date is required';
  } else if (new Date(couponData.startDate) < new Date().setHours(0, 0, 0, 0)) {
    errors.startDate = 'Start date must be today or in the future';
  }

  if (!couponData.endDate) {
    errors.endDate = 'End date is required';
  } else if (
    couponData.startDate &&
    couponData.endDate &&
    new Date(couponData.endDate) <= new Date(couponData.startDate)
  ) {
    errors.endDate = 'End date must be after start date';
  }

  return errors;
};
