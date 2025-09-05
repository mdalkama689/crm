import {Router} from 'express'
import { authMiddleware } from '../middlewares/auth-middleware';
import upload from '../middlewares/multer.middleware';
import { addComment } from '../controller/comment-controller';

const router = Router()

router.post(
  '/project/:projectId/task/:taskId/add-comment',
  authMiddleware,
  upload.single('attachment'),
  addComment,
);
 


export default router 