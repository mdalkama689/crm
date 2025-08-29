import { Router } from 'express';
import { addTask, fetchAllProjectTasks } from '../controller/task-controller';
import upload from '../middlewares/multer.middleware';
import { authMiddleware } from '../middlewares/auth-middleware';

const router = Router();

router.post(
  '/add-task/:id',
  authMiddleware,
  upload.single('attachment'),
  addTask, 
);

router.get("/project/:id/tasks", authMiddleware, fetchAllProjectTasks)

export default router;
