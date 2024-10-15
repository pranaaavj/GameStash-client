export const validateSignUp = (userInput) => {
  let validation = {};
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (userInput.password !== userInput.cPassword) {
    validation.cPassword = 'Password do not match.';
    return validation;
  }

  if (userInput.name == '') validation.name = 'Name cannot be empty.';

  if (userInput.phoneNumber == '') {
    validation.email = 'Email cannot be empty.';
  } else if (userInput.phoneNumber.length !== 10) {
    validation.phoneNumber =
      'Invalid phone number. Please enter exactly 10 digits, and ensure it contains only numbers.';
  }

  if (userInput.password == '') {
    validation.password = 'Password cannot be empty.';
  } else if (!passwordRegex.test(userInput.password)) {
    validation.password =
      'Password must be at least 6 characters long and include at least one letter and one number.';
  }

  return validation;
};
