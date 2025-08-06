const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const checkEmailFormatValid = (email: string) => {
  return emailRegex.test(email);
};
