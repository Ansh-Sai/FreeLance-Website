const express = require('express');
const router  = express.Router();
const Bid     = require('../models/Bid');
const Project = require('../models/Project');

// POST /api/bids — submit a new bid
router.post('/', async (req, res) => {
  try {
    const { projectId, freelancerId, amount, proposal } = req.body;
    if (!projectId || !freelancerId || !amount || !proposal) {
      return res.status(400).json({ message: 'Missing required bid fields.' });
    }
    const bid = new Bid({ projectId, freelancerId, amount, proposal });
    await bid.save();
    res.status(201).json(bid);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating bid.' });
  }
});

// GET /api/bids/project/:projectId — get all bids for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const bids = await Bid.find({ projectId: req.params.projectId })
      .populate('freelancerId', 'name email');
    res.json(bids);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching bids.' });
  }
});

// GET /api/bids/freelancer/:freelancerId — get all bids by a freelancer
// Used by the freelancer dashboard to check bid statuses
router.get('/freelancer/:freelancerId', async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.params.freelancerId })
      .populate('projectId', 'title budget description');
    res.json(bids);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching freelancer bids.' });
  }
});

// PATCH /api/bids/:bidId/accept — company accepts a bid
router.patch('/:bidId/accept', async (req, res) => {
  try {
    const { bidId } = req.params;

    // 1. Find the bid
    const bid = await Bid.findById(bidId);
    if (!bid) return res.status(404).json({ message: 'Bid not found.' });

    // 2. Mark this bid as accepted
    bid.status = 'accepted';
    await bid.save();

    // 3. Reject all other bids on the same project
    await Bid.updateMany(
      { projectId: bid.projectId, _id: { $ne: bidId } },
      { $set: { status: 'rejected' } }
    );

    // 4. Mark the project as in-progress (if Project model has a status field)
    await Project.findByIdAndUpdate(bid.projectId, { status: 'in-progress' });

    res.json({ message: 'Bid accepted successfully.', bid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error accepting bid.' });
  }
});

module.exports = router;
