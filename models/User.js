const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['freelancer', 'company'], required: true },
    
    // Profile Fields (Optional until they fill them out)
    phone: String,
    location: String,
    bio: String,
    skills: [String],
    hourlyRate: Number,
    experienceLevel: String,
    availability: String,
    github: String,
    linkedin: String,
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);