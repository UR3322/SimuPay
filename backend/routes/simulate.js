const router = require('express').Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { calculateFee } = require('../utils/simulate');

const round2 = (n) => Math.round(n * 100) / 100;

router.post('/transfer', auth, validate, async (req, res) => {
  const { receiverEmail } = req.body;
  const amount = round2(Number(req.body.amount));

  try {
    const receiver = await User.findOne({ email: receiverEmail.toLowerCase().trim() });
    if (!receiver) return res.status(404).json({ message: 'Receiver not found' });

    if (receiver._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot transfer to yourself' });
    }

    const fee = round2(calculateFee(amount));
    const totalCost = round2(amount + fee);

    // Atomic debit with a balance guard: concurrent transfers can never
    // overdraw the sender. If no document matched, balance was insufficient.
    const sender = await User.findOneAndUpdate(
      { _id: req.user._id, balance: { $gte: totalCost } },
      { $inc: { balance: -totalCost } },
      { new: true }
    );

    if (!sender) {
      return res.status(400).json({ message: 'Insufficient balance (includes 2% transfer fee)' });
    }

    // Credit the receiver; roll the debit back if this fails.
    const credited = await User.findByIdAndUpdate(receiver._id, { $inc: { balance: amount } });
    if (!credited) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { balance: totalCost } });
      return res.status(500).json({ message: 'Transfer failed, amount refunded' });
    }

    const transaction = await Transaction.create({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      fee,
      status: 'Completed',
    });

    res.status(200).json({
      message: 'Transaction completed successfully',
      transaction,
      newBalance: round2(sender.balance),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
