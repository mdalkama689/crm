import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth-middleware';
import {
  getNotifications,
  markAllNotificationAsRead,
  markNotificationAsRead,
} from '../controller/notification-controller';

const router = Router();

router.get('/all', authMiddleware, getNotifications);
router.get('/:id', authMiddleware, markNotificationAsRead);
router.patch("/mark-all-seen", authMiddleware, markAllNotificationAsRead) 
export default router;
