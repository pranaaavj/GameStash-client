export const validateImages = (images) => {
  let validation = '';

  // Validation for images
  if (!Array.isArray(images) || images.length < 3) {
    validation = 'You have to upload at least 3 images.';
  } else if (images.length > 6) {
    validation = 'You cannot upload more than 6 images.';
  } else if (!images.every((image) => typeof image === 'string')) {
    validation = 'Each image must be a valid URL or string.';
  }

  return validation;
};
