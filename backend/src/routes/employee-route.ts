import { Router } from 'express';
import {
  changeEmployeeRole,
  changePassword,
  fetchAllEmployeesForTenant,
  fetchAuthenticatedUser,
  forgotPassword,
  getEmployeeAvatar,
  logout,
  resetPassword,
  sendInvitation,
  signIn,
  subscribeNewsletter,
  updateProfileDetails,
  validateTokenAndSignUp,
  verifyOtp,
} from '../controller/employee-controller';
import { authMiddleware } from '../middlewares/auth-middleware';
import { adminMiddleware } from '../middlewares/admin-middleware';

const router = Router();

router.post('/sign-in', signIn);
router.post(
  '/send-invitation',
  authMiddleware,
  adminMiddleware,
  sendInvitation,
);
router.post('/sign-up', validateTokenAndSignUp);
router.post('/log-out', logout);
router.post('/subscribe-news-letter', subscribeNewsletter);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.get('/me', authMiddleware, fetchAuthenticatedUser);
router.get('/get-avatar-url-from-gravatar', authMiddleware, getEmployeeAvatar);
router.get(
  '/fetch-all-employees-for-tenant',
  authMiddleware,
  adminMiddleware,
  fetchAllEmployeesForTenant,
);
router.post(
  '/change-employee-role',
  authMiddleware,
  adminMiddleware,
  changeEmployeeRole,
);

router.patch('/update-user-details', authMiddleware, updateProfileDetails)
router.patch('/change-password', authMiddleware, changePassword)
export default router;
