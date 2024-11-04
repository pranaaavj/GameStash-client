export const validateChangePassword = (passwordData) => {
  let validation = {};
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  if (!passwordData.currentPassword) {
    validation.currentPassword = 'Current password cannot be empty.';
  }

  if (!passwordData.newPassword) {
    validation.newPassword = 'New password cannot be empty.';
  } else if (!passwordRegex.test(passwordData.newPassword)) {
    validation.newPassword =
      'Password must be at least 6 characters long and include at least one letter and one number.';
  }

  if (passwordData.newPassword !== passwordData.confirmNewPassword) {
    validation.confirmNewPassword = 'Passwords do not match.';
  }

  return validation;
};
