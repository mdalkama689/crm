import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware";
import { adminMiddleware } from "../middlewares/admin-middleware";
import { createProject } from "../controller/project-controller";

const router = Router()

router.post('/create-project', authMiddleware, adminMiddleware, createProject)

export default router
