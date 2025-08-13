import express from 'express';
import {
    deleteUser,
    getAllUsers, // New
    getSingleUser, // New
    grantAdminAccess,
    login,
    logout,
    register,
    resetPassword,
    sendInitialVerifyOtp,
    sendResetOtp, // New
    updateUser,
    verifyEmailSignup,
} from '../controllers/userController.js';

const userRouter = express.Router();

// ------------------------------
// ✅ Public Routes
// ------------------------------
userRouter.post('/register', register); // Register user
userRouter.post('/login', login); // Login user
userRouter.post('/logout', logout); // Logout user

userRouter.post('/verify-email-signup', verifyEmailSignup); // Email verification with OTP
userRouter.post('/send-initial-verify-otp', sendInitialVerifyOtp); // Resend email verification OTP

userRouter.post('/send-reset-otp', sendResetOtp); // Send password reset OTP
userRouter.post('/reset-password', resetPassword); // Reset password using OTP

userRouter.get('/all-users', getAllUsers);
userRouter.route('/:id')
    .get(getSingleUser)
    .put(updateUser)
    .delete(deleteUser);
userRouter.post('/grant-admin/:id', grantAdminAccess);

export default userRouter;
