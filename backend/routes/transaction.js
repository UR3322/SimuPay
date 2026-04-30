const router = require('express').Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

router.get('/history', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ sender: req.user._id })
      .populate('receiver', 'username email')
      .sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;