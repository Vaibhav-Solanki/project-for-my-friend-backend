// Import the Mongoose library
const mongoose = require('mongoose');

// Define the MongoDB URI. It uses an environment variable DATABASE,
// or a default URI if the environment variable is not set.
const URI = process.env.DATABASE || 'mongodb+srv://root:2qzojWOdCMsfqjDU@noman.mqsbisz.mongodb.net/?retryWrites=true&w=majority';

// Define an asynchronous function for connecting to the database
const connectDB = async () => {
    try {
        // Use await to establish a connection to the MongoDB server
        await mongoose.connect(URI);

        // Log a message to indicate a successful connection
        console.log("Connected to MongoDB");
    } catch (error) {
        // If an error occurs during connection, log the error
        console.error("Error connecting to MongoDB:", error);
    }
};

// Export the connectDB function to make it available for use in other parts of the application
module.exports = connectDB;
