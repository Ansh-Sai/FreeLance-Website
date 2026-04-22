const express = require('express');
const router = express.Router();
const Project = require('../models/Project'); // Import your Project model

// ==========================================
// GET /api/projects
// Fetch all open projects for the dashboard
// ==========================================
router.get('/', async (req, res) => {
    try {
        // Find all projects, sort by newest first
        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server error while fetching projects' });
    }
});

// ==========================================
// POST /api/projects
// Create a new project (Company only)
// ==========================================
router.post('/', async (req, res) => {
    try {
        const { title, description, budget } = req.body;

        // Basic validation
        if (!title || !description || !budget) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Create new project
        const newProject = new Project({
            title,
            description,
            budget
        });

        // Save to database
        const savedProject = await newProject.save();

        res.status(201).json({ 
            message: 'Project posted successfully!', 
            project: savedProject 
        });

    } catch (error) {
        console.error('Error posting project:', error);
        res.status(500).json({ message: 'Server error while posting project' });
    }
});

module.exports = router;