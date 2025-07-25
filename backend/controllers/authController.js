import userModel from "../models/User.js"; // Ensure .js extension

export const getUserData= async (req, res) => {
    try{
        // Use req.user which is set by the authMiddleware from the JWT token
        const userID = req.user;
        if (!userID) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User ID not found in token."
            });
        }

        const user = await userModel.findById(userID);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json ({
            success: true,
            user: {
                id: user._id,
                email: user.email, // <-- ADDED: Include user's email
                isAccountVerified: user.isAccountVerified,
            }
        });

    } catch (error){
        console.error("Error fetching user data:", error); // Log the error for debugging
        res.status(500).json({ // Return 500 for server errors
            success: false,
            message: error.message || "Failed to fetch user data."
        });
    }
}
