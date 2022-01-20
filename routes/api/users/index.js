import { Router } from 'express';
import { registration, login, logout, current, uploadAvatar } from '../../../controllers/auth';
import guard from '../../../middlewares/guard';
import { upload } from '../../../middlewares/upload';

const router = new Router();

router.post('/signup', registration);
router.post('/login', login);
router.post('/logout', guard, logout);
router.get('/current', guard, current);
router.patch('/avatar', guard, upload.single('avatar'), uploadAvatar)

export default router