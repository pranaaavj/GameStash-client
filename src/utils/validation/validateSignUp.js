export const validateSignUp = (userInput) => {
  let validation = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  if (userInput.password !== userInput.cPassword) {
    validation.cPassword = 'Password do not match';
    return validation;
  }

  if (userInput.name == '') validation.name = 'Name cannot be empty';

  if (userInput.email == '') {
    validation.email = 'Email cannot be empty';
  } else if (!emailRegex.test(userInput.email)) {
    validation.email = 'Please enter a valid email';
  }

  if (userInput.password == '') {
    validation.password = 'Password cannot be empty';
  } else if (!passwordRegex.test(userInput.password)) {
    validation.password =
      'Password must be at least 6 characters long and include at least one letter and one number';
  }

  return validation;
};
