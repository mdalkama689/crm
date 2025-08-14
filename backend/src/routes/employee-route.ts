import { Router } from 'express';
import {
  validateTokenAndSignUp,
  signIn,
  logout,
  subscribeNewLetter,
  forgotPassword,
  verifyOtp,
  resetPassword,
  userDetails,
  fetchProfilePhotoFromGravatar,
} from '../controller/employee-controller';
import { authMiddleware } from '../middlewares/auth-middleware';

const router = Router();

router.post('/sign-up', validateTokenAndSignUp);
router.post('/sign-in', signIn);
router.post('/log-out', logout);
router.post('/subscribe-news-letter', subscribeNewLetter);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.get('/me', authMiddleware, userDetails);
router.get(
  '/fetch-profile-pic-from-gravatar',
  authMiddleware,
  fetchProfilePhotoFromGravatar,
);

export default router;
