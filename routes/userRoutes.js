require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const cors = require('cors');




// Registration endpoint
router.get('/', function (req, res) {
    res.send('Welcome to the user Routes');
});


router.get('/all', async function (req, res) {
    try {
        const users = await User.find({});
        // console.log(users);
        res.json(users);
    } catch (error) {
        console.error('Error retrieving users:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // If the user is found and the password matches
        if (user) {
            // Replace 'your-secret-key' with your actual secret key
            const secretKey = process.env.Secret;

            // Generate a JWT token with the user's information, including user ID
            const token = jwt.sign({ userId: user._id, username: user.username }, secretKey);

            // Send the token in the response
            res.status(200).json({ message: 'Login successful', token });
        } else {
            // Return a 401 status for invalid credentials
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        // Handle server errors with a 500 status
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/user-data', async (req, res) => {
    try {
        // Get the token from the request headers
        const token = req.headers.authorization.split(' ')[1];

        // Replace 'your-secret-key' with your actual secret key
        const secretKey = process.env.Secret;

        // Verify and decode the token
        const decodedToken = jwt.verify(token, secretKey);

        // Assuming you have a User model
        const user = await User.findById(decodedToken.userId);

        // Send user data in the response
        res.status(200).json({ username: user.username });
    } catch (error) {
        // Handle token verification errors with a 401 status
        console.error(error);
        res.status(401).json({ error: 'Unauthorized' });
    }
});







module.exports = router;