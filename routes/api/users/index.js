import { Router } from 'express';
import { registration, login, logout, current } from '../../../controllers/auth';
import guard from '../../../middlewares/guard';

const router = new Router();

router.post('/signup', registration);
router.post('/login', login);
router.post('/logout', guard, logout);
router.get('/current', guard, current);

export default router