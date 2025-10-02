import { Router } from 'express';
import {
  addTask,
  addTaskItem,
  downloadFile,
  fetchAllTaskItem,
  fetchProjectTasks,
  getFileLength,
  getProjectTaskPages,
  preSignedUrl,
  toggleTaskCompletion,
  toggleTaskItemCompletion,
  updateTaskAttachment,
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

router.get('/project/:id/tasks', authMiddleware, fetchProjectTasks);
router.get('/project/:id/task-pages', authMiddleware, getProjectTaskPages);
router.get('/project/:id/file-pages', authMiddleware, getFileLength);

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
  '/project/:projectId/task/:taskId/toggle',
  authMiddleware,
  toggleTaskCompletion,
);

router.patch(
  '/project/:projectId/task/:taskId/taskItem/:taskItemId/toggle',
  authMiddleware,
  toggleTaskItemCompletion,
);

router.post('/download/file', authMiddleware, downloadFile);
router.post("/upload", authMiddleware, upload.single("file"),  preSignedUrl)
router.patch(
  '/project/:projectId/task/:taskId/update-attachment',
  authMiddleware,
  upload.single('attachment'),
  updateTaskAttachment,
);

export default router;
