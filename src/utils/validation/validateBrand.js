export const validateBrand = (brandInput) => {
  let validation = {};

  // Validation for name
  if (brandInput.name === '') {
    validation.name = 'Brand name cannot be empty.';
  } else if (brandInput.name.length < 3) {
    validation.name = 'Brand name must be at least 3 characters long.';
  }

  return validation;
};
