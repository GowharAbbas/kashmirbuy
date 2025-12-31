import { Router } from 'express'
import { forgotPasswordController, getAllUsers, loginUserController, logoutController, refreshToken, registerUserController, removeImageFromCloudinary, resetPasswordController, updateUserDetails, userAvatarController, userDetails, verifyEmailController, verifyForgotPasswordOtp } from '../controllers/user.controller.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';

const userRouter = Router();
userRouter.post('/register',registerUserController);
userRouter.post('/verifyEmail',verifyEmailController);
userRouter.post('/login',loginUserController);
userRouter.get('/logout',auth,logoutController);

//userRouter.put('/user-avatar',auth,upload.array('avatar'),userAvatarController);
//new

userRouter.put('/user-avatar', auth, userAvatarController);

userRouter.delete('/deleteImage',auth,removeImageFromCloudinary);
userRouter.put('/:id',auth,updateUserDetails);
userRouter.post('/forgot-password',forgotPasswordController);
userRouter.post('/verify-forgot-password-otp', verifyForgotPasswordOtp);
userRouter.post('/reset-password',resetPasswordController);
userRouter.post('/refresh-token',refreshToken);
userRouter.get('/user-details',auth,userDetails);
userRouter.get('/all',auth, getAllUsers);

export default userRouter
