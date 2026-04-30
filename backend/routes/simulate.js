const router = require('express').Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { calculateFee } = require('../utils/simulate');

router.post('/transfer', auth, validate, async (req, res) => {
  const { receiverEmail, amount } = req.body;
  const parsedAmount = parseFloat(amount);

  try {
    const sender = await User.findById(req.user._id);
    const receiver = await User.findOne({ email: receiverEmail });

    if (!receiver) return res.status(404).json({ message: 'Receiver not found' });
    if (sender.email === receiver.email) return res.status(400).json({ message: 'Cannot transfer to yourself' });

    const fee = calculateFee(parsedAmount);
    const totalCost = parsedAmount + fee;

    if (sender.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient balance (includes 2% transfer fee)' });
    }

    sender.balance -= totalCost;
    receiver.balance += parsedAmount;

    await sender.save();
    await receiver.save();

    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount: parsedAmount,
      fee: fee,
      status: 'Completed',
    });

    await transaction.save();

    res.status(200).json({
      message: 'Transaction completed successfully',
      transaction,
      newBalance: sender.balance,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;