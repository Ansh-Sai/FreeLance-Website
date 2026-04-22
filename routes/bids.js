const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid'); // Ensure this points to your Bid model

// POST /api/bids - Place a new bid
router.post('/', async (req, res) => {
    try {
        const { projectId, freelancerId, amount, proposal } = req.body;

        // Basic validation
        if (!projectId || !freelancerId || !amount) {
            return res.status(400).json({ message: 'Missing required bid fields.' });
        }

        // Create and save the new bid
        const newBid = new Bid({
            projectId,
            freelancerId,
            amount,
            proposal,
            status: 'pending' // Default status
        });

        await newBid.save();
        res.status(201).json({ message: 'Bid submitted successfully!', bid: newBid });

    } catch (err) {
        console.error('Error saving bid:', err);
        res.status(500).json({ message: 'Server error while submitting bid.' });
    }
});

module.exports = router;