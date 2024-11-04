export const validateProfile = (profileInput) => {
  let validation = {};
  const phoneRegex = /^\d{10}$/;

  // Validate Name
  if (!profileInput.name || profileInput.name.trim() === '') {
    validation.name = 'Name cannot be empty.';
  }
  // Validate Phone Number (optional)
  if (profileInput.phoneNumber && !phoneRegex.test(profileInput.phoneNumber)) {
    validation.phoneNumber = 'Please enter a valid phone number.';
  }

  return validation;
};
