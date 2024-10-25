export const validateProduct = (productInput) => {
  let validation = {};

  // Validation for name
  if (productInput.name === '') {
    validation.name = 'Name cannot be empty.';
  } else if (productInput.name.length < 3) {
    validation.name = 'Name must be at least 3 characters long.';
  }

  // Validation for price
  if (productInput.price === '') {
    validation.price = 'Price cannot be empty.';
  } else if (isNaN(productInput.price) || productInput.price <= 0) {
    validation.price = 'Price must be a positive number.';
  }

  // Validation for genre
  if (productInput.genre === '') {
    validation.genre = 'Genre cannot be empty.';
  }

  // Validation for platform
  if (productInput.platform === '') {
    validation.platform = 'Platform cannot be empty.';
  }

  // // Validation for images
  // if (!Array.isArray(productInput.images) || productInput.images.length === 0) {
  //   validation.images = 'At least one image is required.';
  // } else if (!productInput.images.every((image) => typeof image === 'string')) {
  //   validation.images = 'Each image must be a valid URL or string.';
  // }

  // // Validation for description
  // if (productInput.description === '') {
  //   validation.description = 'Description cannot be empty.';
  // } else if (productInput.description.length < 10) {
  //   validation.description = 'Description must be at least 10 characters long.';
  // }

  // Validation for brand
  if (productInput.brand === '') {
    validation.brand = 'Brand cannot be empty.';
  }

  // Validation for stock
  if (productInput.stock === '') {
    validation.stock = 'Stock cannot be empty.';
  } else if (isNaN(productInput.stock) || parseInt(productInput.stock) < 0) {
    validation.stock = 'Stock must be a non-negative integer.';
  }

  return validation;
};
