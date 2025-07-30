// File: backend/models/User.js
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false // Don't send password back in query results by default
    },
     firstName: {
        type: String,
        trim: true,
        default: ''
    },
    lastName: {
        type: String,
        trim: true,
        default: ''
    },
    phone: { // NEW FIELD: Phone number
        type: String,
        trim: true,
        default: ''
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    verifyOtp: { // For email verification
        type: String,
        default: ''
    },
    verifyOtpExpireAt: { // For email verification
        type: Number,
        default: null
    },
    resetOtp: { // For password reset
        type: String,
        default: ''
    },
    resetOtpExpireAt: { // For password reset (corrected typo)
        type: Number,
        default: null
    },
    
    //Something Dilaksan added idk why
    cart: [
        {
            bookId: {
                type: mongoose.Schema.ObjectId,
                ref: 'Book', // Assuming you'll have a Book model
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
});



userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
const UserModel = mongoose.models.User || mongoose.model('User', userSchema); // Changed 'user' to 'User' for consistency

export default UserModel;