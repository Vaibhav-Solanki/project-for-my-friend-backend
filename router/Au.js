// Import necessary modules and dependencies
const { Router } = require('express');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../model/regschema'); // Importing the User schema

// Route for rendering the login page (GET request)
router.get('/Au', (req, res) => {
    res.send('login page');
});

// Route for handling user authentication (POST request)
router.post("/Au", async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    // Check if email and password are provided in the request
    if (!email || !password) {
        return res.status(400).json({ error: "Fields should not be empty" });
    }

    try {
        // Find a user with the provided email
        const userlog = await User.findOne({ email: email });

        if (!userlog) {
            // If the user doesn't exist, return an error message
            res.status(400).json({ message: "Invalid user credentials" });
        } else {
            // Compare the provided password with the stored hashed password
            const isMatch = await bcrypt.compare(password, userlog.password);

            if (isMatch) {
                if (userlog.st === "active") {
                    // If the password is correct and the user status is "active", generate a JWT token and set it as a cookie
                    const token = await userlog.generateAuthToken();
                    res.cookie('jwtoken', token, {
                        expires: new Date(Date.now() + 258920000),
                        httpOnly: true
                    });
                    res.json({ message: "Sign-in success" });
                    console.log("Password is correct");
                } else {
                    // If the user status is not "active", return a message indicating payment pending
                    res.json({ message: "User Payment Is Pending" });
                }
            } else {
                // If the password did not match, return an error message
                res.json({ message: "Password did not match" });
                console.log("Password did not match");
            }
        }
    } catch (err) {
        console.log(err);
    }
});

// Export the router to make it available for use in other parts of the application
module.exports = router;
