import { Router } from 'express';
import { register, login, getProfile, logout, getUsers } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authMiddleware, getProfile);
router.get('/users', authMiddleware, getUsers);

export default router;



