import {Router} from 'express'
import { authMiddleware } from '../middlewares/auth-middleware';
import upload from '../middlewares/multer.middleware';
import { addComment, getCommentsByProjectId } from '../controller/comment-controller';

const router = Router()
//  getCommentsByProjectId
router.post(
  '/project/:projectId/task/:taskId/add-comment',
  authMiddleware,
  upload.single('attachment'),
  addComment,
);
 

router.get(
  '/projects/:projectId/comments',
  authMiddleware,
getCommentsByProjectId 
);
 



export default router 