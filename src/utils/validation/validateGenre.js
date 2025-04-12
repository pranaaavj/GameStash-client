export const validateGenre = (genreInput) => {
  let validation = {};

  // Validation for name
  if (genreInput.name.trim() === '') {
    validation.name = 'Name cannot be empty.';
  } else if (genreInput.name.length < 3) {
    validation.name = 'Name must be at least 3 characters long.';
  }

  return validation;
};
