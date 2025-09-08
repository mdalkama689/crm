import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth-middleware';
import upload from '../middlewares/multer.middleware';
import {
  addComment,
  getAllFileByProjectId,
  getCommentsByProjectId,
} from '../controller/comment-controller';

const router = Router();

router.post(
  '/project/:projectId/task/:taskId/add-comment',
  authMiddleware,
  upload.single('attachment'),
  addComment,
);

router.get(
  '/projects/:projectId/comments',
  authMiddleware,
  getCommentsByProjectId,
);

router.get('/projects/:projectId/files', authMiddleware, getAllFileByProjectId);

export default router;
