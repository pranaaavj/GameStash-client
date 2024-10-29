export const validateBrand = (brandInput) => {
  let validation = {};

  // Validation for name
  if (brandInput.name === '') {
    validation.name = 'Brand name cannot be empty.';
  } else if (brandInput.name.length < 3) {
    validation.name = 'Brand name must be at least 3 characters long.';
  }

  // Validation for description
  if (brandInput.description === '') {
    validation.description = 'Description cannot be empty.';
  } else if (brandInput.description.length < 10) {
    validation.description = 'Description must be at least 10 characters long.';
  }

  return validation;
};
