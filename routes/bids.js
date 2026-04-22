const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');

// POST /api/bids - Place a new bid
router.post('/', async (req, res) => {
    try {
        const { projectId, freelancerId, amount, proposal } = req.body;

        if (!projectId || !freelancerId || !amount) {
            return res.status(400).json({ message: 'Missing required bid fields.' });
        }

        const newBid = new Bid({
            projectId,
            freelancerId,
            amount,
            proposal,
            status: 'pending'
        });

        await newBid.save();
        res.status(201).json({ message: 'Bid submitted successfully!', bid: newBid });

    } catch (err) {
        console.error('Error saving bid:', err);
        res.status(500).json({ message: 'Server error while submitting bid.' });
    }
});

// ✅ GET /api/bids/project/:projectId - Fetch all bids for a project (with freelancer name & email)
router.get('/project/:projectId', async (req, res) => {
    try {
        const bids = await Bid.find({ projectId: req.params.projectId })
            .populate('freelancerId', 'name email'); // pulls name & email from User model

        res.status(200).json(bids);

    } catch (err) {
        console.error('Error fetching bids:', err);
        res.status(500).json({ message: 'Server error while fetching bids.' });
    }
});

module.exports = router;