import { Router } from 'express';
import { registration, login, logout, current, uploadAvatar, verifyUser, repeatEmailForVerifyUser } from '../../../controllers/auth';
import guard from '../../../middlewares/guard';
import { upload } from '../../../middlewares/upload';
import wrapperError from '../../../middlewares/error-handler';

const router = new Router();

router.post('/signup', wrapperError(registration));
router.post('/login', wrapperError(login));
router.post('/logout', guard, wrapperError(logout));
router.get('/current', guard, wrapperError(current));
router.patch('/avatar', guard, upload.single('avatar'), wrapperError(uploadAvatar));
router.get('/verify/:verificationToken', wrapperError(verifyUser));
router.post('/verify', wrapperError(repeatEmailForVerifyUser));

export default router