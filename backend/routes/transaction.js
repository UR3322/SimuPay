const router = require('express').Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Full history: transfers the user sent AND received
router.get('/history', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate('sender', 'username email')
      .populate('receiver', 'username email')
      .sort({ createdAt: -1 })
      .limit(100);

    const withDirection = transactions.map((tx) => ({
      ...tx.toObject(),
      direction: tx.sender._id.toString() === req.user._id.toString() ? 'sent' : 'received',
    }));

    res.status(200).json(withDirection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
