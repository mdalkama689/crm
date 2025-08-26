import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth-middleware';
import {
  getNotifications,
  markNotificationAsRead,
} from '../controller/notification-controller';

const router = Router();

router.get('/all', authMiddleware, getNotifications);
router.get('/:id', authMiddleware, markNotificationAsRead);
export default router;
