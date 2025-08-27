import {Router} from 'express'
import { addTask } from '../controller/task-controller'
import upload from '../middlewares/multer.middleware'
import { authMiddleware } from '../middlewares/auth-middleware'

const router = Router()

router.post('/add-task/:id', authMiddleware, upload.single("attachment"),  addTask)

export default router 