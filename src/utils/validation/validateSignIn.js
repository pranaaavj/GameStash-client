export const validateSignIn = (userInput) => {
  let validation = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (userInput.email == '') {
    validation.email = 'Email cannot be empty.';
  } else if (!emailRegex.test(userInput.email)) {
    validation.email = 'Please enter a valid email.';
  }

  if (userInput.password == '') {
    validation.password = 'Password cannot be empty.';
  }

  return validation;
};
