import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth-middleware';
import { adminMiddleware } from '../middlewares/admin-middleware';
import {
  createProject,
  deleteProject,
  getAdminCreatedProjects,
  getAllProjectsOfCompany,
  getAssignedEmployeesForProject,
  getProjectForAdminAndAssignee,
} from '../controller/project-controller';
import upload from '../middlewares/multer.middleware';

const router = Router();

router.post(
  '/create-project',
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: 'attachment', maxCount: 1 },
    { name: 'icon', maxCount: 1 },
  ]),
  createProject,
);

router.delete(
  '/delete-project/:id',
  authMiddleware,
  adminMiddleware,
  deleteProject,
);
router.get('/project/:id', authMiddleware, getProjectForAdminAndAssignee);
router.get(
  '/projects-created-by-me',
  authMiddleware,
  adminMiddleware,
  getAdminCreatedProjects,
);
router.get(
  '/projects-all',
  authMiddleware,
  adminMiddleware,
  getAllProjectsOfCompany,
);

router.get(
  '/project/:id/assigned-employees',
  authMiddleware,
  getAssignedEmployeesForProject,
);

export default router;
