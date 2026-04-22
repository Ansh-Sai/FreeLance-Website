const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Core auth fields
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['freelancer', 'company'], required: true },

  // Profile fields (both roles)
  dob:      { type: String, default: '' },
  phone:    { type: String, default: '' },
  location: { type: String, default: '' },
  bio:      { type: String, default: '' },
  github:   { type: String, default: '' },
  linkedin: { type: String, default: '' },

  // Freelancer-specific
  skills:       { type: [String], default: [] },
  hourlyRate:   { type: Number,   default: 0  },
  experience:   { type: String,   default: '' }, // 'beginner' | 'intermediate' | 'expert'
  availability: { type: String,   default: '' }, // 'fulltime' | 'parttime' | 'freelance'

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
