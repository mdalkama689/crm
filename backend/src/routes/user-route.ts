import { Router } from 'express';
import {
  companyDetails,
  forgotPassword,
  logout,
  resetPassword,
  signIn,
  signUp,
  subscribeNewLetter,
  userDetails,
  verifyOtp,
} from '../controller/user-controller';

const router = Router();

router.post('/sign-up', signUp);
router.post('/company-details', companyDetails);
router.post('/sign-in', signIn);
router.post('/log-out', logout);
router.get('/me', userDetails);
router.post('/subscribe-news-letter', subscribeNewLetter);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;
