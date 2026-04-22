const mongoose = require('mongoose');

// Define the blueprint for a Project
const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Completed'],
        default: 'Open'
    },
    // We'll track when it was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compile the schema into a model and export it
module.exports = mongoose.model('Project', projectSchema);