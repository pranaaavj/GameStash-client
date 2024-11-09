export const validateAddress = (addressInput) => {
  let validation = {};

  // Validation for address name
  if (addressInput.addressName === '') {
    validation.addressName = 'Location name cannot be empty.';
  } else if (addressInput.addressName.length < 3) {
    validation.addressName =
      'Location name must be at least 3 characters long.';
  }

  // Validation for address line
  if (addressInput.addressLine === '') {
    validation.addressLine = 'Address line cannot be empty.';
  } else if (addressInput.addressLine.length < 5) {
    validation.addressLine = 'Address line must be at least 5 characters long.';
  }

  // Validation for city
  if (addressInput.city === '') {
    validation.city = 'City cannot be empty.';
  } else if (addressInput.city.length < 3) {
    validation.city = 'City must be at least 3 characters long.';
  }

  // Validation for state
  if (addressInput.state === '') {
    validation.state = 'State/Province cannot be empty.';
  }

  // Validation for zip code
  if (addressInput.zip === '') {
    validation.zip = 'ZIP/Postal Code cannot be empty.';
  } else if (!/^\d{5,6}$/.test(addressInput.zip)) {
    validation.zip = 'ZIP/Postal Code must be a valid number.';
  }

  // Validation for country
  if (addressInput.country === '') {
    validation.country = 'Country cannot be empty.';
  }

  return validation;
};
