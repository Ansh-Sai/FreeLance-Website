const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import your User model

// ==========================================
// POST /api/auth/signup
// Register a new user
// ==========================================
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // 2. Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create and save the new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });
        await user.save();

        // 4. Send success response (excluding the password)
        res.status(201).json({ 
            message: 'User created successfully!', 
            user: { id: user._id, name: user.name, email: user.email, role: user.role } 
        });

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// ==========================================
// POST /api/auth/login
// Authenticate an existing user
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // 2. Compare the entered password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // 3. Send success response
        res.status(200).json({ 
            message: 'Login successful', 
            user: { id: user._id, name: user.name, email: user.email, role: user.role } 
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;