export const generateOtp = () => {
  const otp = Math.floor(Math.random() * 1000000 + 1);
  return otp.toString();
};
