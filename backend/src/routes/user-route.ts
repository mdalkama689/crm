import { Router } from 'express';
import {
  changeRole,
  companyDetails,
  forgotPassword,
  logout,
  resetPassword,
  sendInvitation,
  signIn,
  signUp,
  subscribeNewLetter,
  verifyOtp,
} from '../controller/user-controller';

import { authMiddleware } from '../middlewares/auth-middleware';
import { adminMiddleware } from '../middlewares/admin-middleware';

const router = Router();

router.post('/sign-up', signUp);
router.post('/company-details', companyDetails);
router.post('/sign-in', signIn);
router.post('/log-out', logout);
router.post('/subscribe-news-letter', subscribeNewLetter);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post(
  '/send-invitation',
  authMiddleware,
  adminMiddleware,
  sendInvitation,
);
router.post(
  '/change-role',
  authMiddleware,
  adminMiddleware,
  changeRole,
);




export default router;
