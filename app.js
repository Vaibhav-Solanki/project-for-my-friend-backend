// Import required modules
const express = require('express');
const connectDB = require('./connection.js');
const cookieParser = require("cookie-parser");
const cors = require('cors')

// Create an Express application
const app = express();

// Connect to the database
connectDB();

app.use(cors())

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Import and use registration router
app.use(require('./router/regi'));

// Import and use authentication router
app.use(require('./router/Au'));

// home
app.get('/',(req,res)=>{
    res.json({message:'Hello world'})
});

// Define the port number, using the environment variable PORT or default to 3000
const port = process.env.PORT || 3000;

// Log the port number to the console
console.log(`Server will listen on port ${port}`);

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
