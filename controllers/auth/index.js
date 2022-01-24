import { HttpCode } from '../../lib/constants';
import AuthService from '../../service/auth';
import { UploadFileService, LocalFileStorage, CloudFileStorage } from '../../service/file-storage';
import { EmailService, SenderSendgrid } from '../../service/email';
import repositioryUsers from '../../repository/users';
import { CustomError } from '../../lib/custom-error';

const authService = new AuthService();

const registration = async (req, res, next) => {
  const { email } = req.body;
  const isUserExist = await authService.isUserExist(email);
    if (isUserExist) {
      throw new CustomError(HttpCode.CONFLICT, 'Such email is already exist')
  };
  const userData = await authService.create(req.body);
  const emailService = new EmailService(
    process.env.NODE_ENV,
    new SenderSendgrid()
  );
  const isSend = await emailService.sendVerifyEmail(
    email,
    userData.name,
    userData.verificationToken
  )
  delete userData.verificationToken
  res.status(HttpCode.CREATED).json({ status: 'success', code: HttpCode.CREATED, data: { ...userData, isSendEmailVerify: isSend } })
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authService.getUser(email, password);
  if (!user) {
    throw new CustomError(HttpCode.UNAUTHORIZED, 'Invalid credentials')
  };
  const token = authService.getToken(user);
  await authService.setToken(user.id, token);
  res.status(HttpCode.OK).json({ status: 'success', code: HttpCode.OK, data: { token } })
};

const logout = async (req, res, next) => {
  await authService.setToken(req.user.id, null)
  res.status(HttpCode.NO_CONTENT)
};

const current = async (req, res) => {
  res.status(HttpCode.OK).json({ email: req.user.email, subscription: "starter"})
}

const uploadAvatar = async (req, res, next) => {
  const uploadService = new UploadFileService(LocalFileStorage, req.file, req.user);
  const avatarUrl = await uploadService.updateAvatar();
  res.status(HttpCode.OK).json({ status: 'success', code: HttpCode.OK, data: { avatarUrl } })
}

const verifyUser = async (req, res, next) => {
  const verifyToken = req.params.token;
  const userFromToken = await repositioryUsers.findByVerifyToken(verifyToken)

  if (userFromToken) {
    await repositioryUsers.updateVerify(userFromToken.id, true)
    res.status(HttpCode.OK).json({ status: 'success', code: HttpCode.OK, data: { message: 'Verification successful' } })
  }
   throw new CustomError(HttpCode.BAD_REQUEST, 'Invalid token')
}

const repeatEmailForVerifyUser = async (req, res, next) => {
  const { email } = req.body;
  const user = await repositioryUsers.findByEmail(email);
  if (user) {
    const { email, name, verificationToken } = user;
    const emailService = new EmailService(process.env.NODE_ENV, new SenderSendgrid());

      const isSend = await emailService.sendVerifyEmail(
      email,
      name,
      verificationToken
      );
    
    if (isSend) {
      return res.status(HttpCode.OK).json({ status: 'success', code: HttpCode.OK, data: { message: 'Verification email sent' }})
    }
    throw new CustomError(HttpCode.SE, 'Service unavailable') 
  }
  throw new CustomError(HttpCode.NOT_FOUND, 'User with email not found')
}

export { registration, login, logout, current, uploadAvatar, verifyUser, repeatEmailForVerifyUser }