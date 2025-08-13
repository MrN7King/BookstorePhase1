import express from 'express';
import {
    changePassword,
    deleteAccount,
    deleteUser,
    getAllUsers, // NEW: Import the new controller
    getSingleUser,
    grantAdminAccess,
    login,
    logout,
    register,
    resetPassword,
    sendInitialVerifyOtp,
    sendResetOtp,
    updateProfile,
    updateUser,
    verifyEmailSignup
} from '../controllers/userController.js';

// Assuming you have these middleware files for authentication and role-based access control
import adminMiddleware from '../middleware/adminMiddleware.js';
import userAuth from '../middleware/authMiddleware.js';

const userRouter = express.Router();

// ------------------------------
// ✅ Public Routes
// ------------------------------
userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/logout', logout);

userRouter.post('/verify-email-signup', verifyEmailSignup);
userRouter.post('/send-initial-verify-otp', sendInitialVerifyOtp);

userRouter.post('/send-reset-otp', sendResetOtp);
userRouter.post('/reset-password', resetPassword);

// ------------------------------
// ✅ User Protected Routes
// These routes are for a logged-in user to manage their own account
// ------------------------------
// NEW: Route to get the current user's data


userRouter.put('/update-profile', userAuth, updateProfile); 
userRouter.put('/change-password', userAuth, changePassword); 
userRouter.delete('/delete-account', userAuth, deleteAccount); 

// ------------------------------
// ✅ Admin Protected Routes
// These routes are for an admin to manage other users
// ------------------------------
userRouter.get('/all-users', userAuth, adminMiddleware, getAllUsers);
userRouter.post('/grant-admin/:id', userAuth, adminMiddleware, grantAdminAccess);

userRouter
    .route('/:id')
    .get(userAuth, adminMiddleware, getSingleUser)
    .put(userAuth, adminMiddleware, updateUser)
    .delete(userAuth, adminMiddleware, deleteUser);

export default userRouter;
