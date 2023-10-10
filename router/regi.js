// Import necessary modules and dependencies
const { Router } = require('express');
const express = require('express');
const router = express.Router();
const User = require('../model/regschema'); // Importing the User schema
const Auth = require('../mid/auth'); // Importing authentication middleware

// Route for rendering the registration page (GET request)
router.get('/regi', (req, res) => {
    res.send('register page');
});

// Route for handling user registration (POST request)
router.post("/regi", async (req, res) => {
    const balance = 0, st = "PENDING";
    const { name, email, phone, activation, password, cpassword } = req.body; // Destructure request body

    // Check if any required field is empty
    if (!name || !email || !phone || !password || !cpassword || !activation) {
        return res.status(422).json({ error: "Please fill all fields" });
    }

    // Check if password and confirm password match
    if (password !== cpassword) {
        return res.status(422).json({ error: "Passwords should match" });
    }

    try {
        // Check if a user with the same email already exists
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "User already exists" });
        }

        // Create a new User object and save it to the database
        const user = new User({ name, email, phone, activation, password, balance, st });
        const success = await user.save();

        if (success) {
            return res.status(201).json({ message: "User registration successful" });
        }
    } catch (err) {
        console.log(err);
    }
});

// Route for rendering the about page (GET request), using the Auth middleware to protect the route
router.get('/abt', Auth, (req, res) => {
    res.send(req.rootUser);
    console.log("about");
});

// Route for logging out the user (GET request)
router.get('/logt', async (req, res) => {
    res.cookie('jwtoken', 'none', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ success: true, message: 'User logged out successfully' });
});

// Route for fetching a specific user's feed (GET request)
router.get('/fid', async (req, res) => {
    try {
        // Find a user with the name "feed" and send their feed data
        const feed = await User.findOne({ name: "feed" });
        res.send(feed.feed);
    } catch (err) {
        console.log(err);
    }
});

// Export the router to make it available for use in other parts of the application
module.exports = router;
