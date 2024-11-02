export const validateProduct = (productInput) => {
  let validation = {};

  // Main product field validations
  if (productInput.name === '') {
    validation.name = 'Name cannot be empty.';
  } else if (productInput.name.length < 3) {
    validation.name = 'Name must be at least 3 characters long.';
  }

  if (productInput.price === '') {
    validation.price = 'Price cannot be empty.';
  } else if (isNaN(productInput.price) || productInput.price <= 0) {
    validation.price = 'Price must be a positive number.';
  }

  if (productInput.genre === '') {
    validation.genre = 'Genre cannot be empty.';
  }

  if (productInput.platform === '') {
    validation.platform = 'Platform cannot be empty.';
  }

  if (productInput.description === '') {
    validation.description = 'Description cannot be empty.';
  } else if (productInput.description.length < 10) {
    validation.description = 'Description must be at least 10 characters long.';
  }

  if (productInput.brand === '') {
    validation.brand = 'Brand cannot be empty.';
  }

  if (productInput.stock === '') {
    validation.stock = 'Stock cannot be empty.';
  } else if (isNaN(productInput.stock) || parseInt(productInput.stock) < 0) {
    validation.stock = 'Stock must be a non-negative integer.';
  }

  // System Requirements Validation
  const systemRequirementsErrors = {};
  if (!productInput.systemRequirements.cpu) {
    systemRequirementsErrors.cpu = 'CPU is required.';
  }
  if (!productInput.systemRequirements.gpu) {
    systemRequirementsErrors.gpu = 'GPU is required.';
  }
  if (!productInput.systemRequirements.ram) {
    systemRequirementsErrors.ram = 'RAM is required.';
  }
  if (!productInput.systemRequirements.storage) {
    systemRequirementsErrors.storage = 'Storage is required.';
  }

  // Only add systemRequirements key if there are errors
  if (Object.keys(systemRequirementsErrors).length > 0) {
    validation.systemRequirements = systemRequirementsErrors;
  }

  return validation;
};
