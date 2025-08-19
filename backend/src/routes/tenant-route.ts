import { Router } from 'express';
import { createTenant, signUp } from '../controller/tenant-controller';

const router = Router();

router.post('/sign-up', signUp);
router.post('/add-company-details/:email', createTenant);

export default router;
