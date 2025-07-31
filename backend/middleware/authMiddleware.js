// backend/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js'; // Assuming you use UserModel to find the user by ID

const userAuth = async (req, res, next) => {
    let token;

    // 1. Check for token in Authorization header (Bearer token)
    // This is common for API calls, though your frontend uses cookies primarily.
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('Token found in Authorization header.');
    }
    // 2. Check for token in cookies
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
        console.log('Token found in cookies.');
    }

    // Check if token is missing, empty, or explicitly set to 'loggedout'
    

    try {
        // Attempt to verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token successfully decoded:', decoded);

        // Find the user associated with the token's ID
        // .select('-password') ensures password hash is not returned
        const currentUser = await UserModel.findById(decoded.id).select('-password');

        if (!currentUser) {
            console.log('Authentication failed: User associated with token not found in DB.');
            return res.status(401).json({ success: false, message: 'Not authorized, user no longer exists.' });
        }

        // Attach the user's ID to the request object for subsequent middleware/controllers
        req.user = currentUser._id;
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
       
    }
};

export default userAuth;
