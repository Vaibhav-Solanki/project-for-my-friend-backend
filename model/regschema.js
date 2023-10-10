// Import necessary modules and dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const jwt = require('jsonwebtoken');

// Define the secret key for JWT (use the environment variable SECRET_KEY or a default value)
const SECRET_KEY = process.env.SECRET_KEY || 'ABGHKJDNSVJHJNLBDNHNJLKMNBFGJKNLB'

// Define the user schema using Mongoose
const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    activation: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: false
    },
    balance: {
        type: Number,
        required: false
    },
    st: {
        type: String,
        required: false
    },
    transi: [
        {
            amount: {
                type: Number,
                required: false
            },
            datew: {
                type: String,
                required: false
            }
        }
    ],
    ref: [
        {
            st: {
                type: String,
                required: false
            },
            nams: {
                type: String,
                required: false
            }
        }
    ],
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    feed: [
        {
            type: String,
            required: false
        }
    ]
});

// Middleware to hash the password before saving it to the database
userschema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 12);
        }
    } catch (error) {
        console.log(error);
    }
});

// Method to generate an authentication token for the user
userschema.methods.generateAuthToken = async function () {
    try {
        // Generate a JWT token using the user's _id and the secret key
        let token = jwt.sign({ _id: this._id }, SECRET_KEY);

        // Add the token to the user's tokens array and save it to the database
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

// Create a User model using the user schema
const User = mongoose.model('REG', userschema);

// Export the User model to make it available for use in other parts of the application
module.exports = User;
