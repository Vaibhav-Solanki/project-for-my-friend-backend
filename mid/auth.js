// Import necessary modules and dependencies
const jwt = require('jsonwebtoken');
const User = require('../model/regschema'); // Importing the User schema

// Define the secret key for JWT (use the environment variable SECRET_KEY or a default value)
const SECRET_KEY = process.env.SECRET_KEY || 'ABGHKJDNSVJHJNLBDNHNJLKMNBFGJKNLB'

// Middleware function for user authentication
const Auth = async (req, res, next) => {
    try {
        // Extract the JWT token from the cookies
        const token = req.cookies.jwtoken;

        // Verify the JWT token using the secret key
        const verifyToken = jwt.verify(token, SECRET_KEY);

        // Find the user associated with the token in the database
        const rootUser = await User.findOne({ _id: verifyToken, "tokens.token": token });

        // If the user is not found, throw an error
        if (!rootUser) {
            throw new Error("User not found");
        }

        // Attach the token, rootUser, and userId to the request object for further use
        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;

        // Call the next middleware or route handler
        next();
    } catch (error) {
        // If there is an error during authentication, return a 401 Unauthorized response
        res.status(401).send("Unauthorized");
        console.log(error);
    }
}

// Export the Auth middleware to make it available for use in other parts of the application
module.exports = Auth;
