const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: 'All fields are required.' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: 'Email already registered.' });

    const hashed = await bcrypt.hash(password, 10);
    const user   = new User({ name, email, password: hashed, role });
    await user.save();

    res.status(201).json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid email or password.' });

    // Return full profile so the frontend has all saved fields immediately
    res.json({
      user: {
        _id:          user._id,
        name:         user.name,
        email:        user.email,
        role:         user.role,
        dob:          user.dob,
        phone:        user.phone,
        location:     user.location,
        bio:          user.bio,
        skills:       user.skills,
        hourlyRate:   user.hourlyRate,
        experience:   user.experience,
        availability: user.availability,
        github:       user.github,
        linkedin:     user.linkedin,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// PATCH /api/auth/profile — save full profile to DB
router.patch('/profile', async (req, res) => {
  try {
    const {
      userId, name, email, dob, phone, location, bio,
      skills, hourlyRate, experience, availability, github, linkedin
    } = req.body;

    if (!userId)
      return res.status(400).json({ message: 'userId is required.' });

    const updated = await User.findByIdAndUpdate(
      userId,
      { name, email, dob, phone, location, bio,
        skills, hourlyRate, experience, availability, github, linkedin },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updated)
      return res.status(404).json({ message: 'User not found.' });

    res.json({ user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error saving profile.' });
  }
});

module.exports = router;
