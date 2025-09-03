import { Router } from 'express';
import {
  addTask,
  addTaskItem,
  fetchAllProjectTasks,
  fetchAllTaskItem,
  toggleTaskItemCompletion,
} from '../controller/task-controller';
import upload from '../middlewares/multer.middleware';
import { authMiddleware } from '../middlewares/auth-middleware';

const router = Router();

router.post(
  '/add-task/:id',
  authMiddleware,
  upload.single('attachment'),
  addTask,
);

router.get('/project/:id/tasks', authMiddleware, fetchAllProjectTasks);

router.post(
  '/project/:projectId/task/:taskId/items',
  authMiddleware,
  addTaskItem,
);

router.get(
  '/project/:projectId/task/:taskId/items',
  authMiddleware,
  fetchAllTaskItem,
);


 
router.patch(
  '/project/:projectId/task/:taskId/taskItem/:taskItemId/toggle',
  authMiddleware,
  toggleTaskItemCompletion,
);

export default router;
