import { RequestHandler, Router } from 'express';
import {
  createUser,
  getUserRole,
  updateUser,
} from '../controllers/user-controller';

const router = Router();

// user routers
router.post('/create', createUser as RequestHandler);
router.get('/role/:email', getUserRole as RequestHandler);
router.put('/update/:email', updateUser as RequestHandler);

export { router as userRoute };
