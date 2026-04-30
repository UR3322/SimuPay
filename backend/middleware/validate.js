module.exports = (req, res, next) => {
  const { receiverEmail, amount } = req.body;
  if (!receiverEmail || !amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid or missing fields: receiverEmail and positive amount are required.' });
  }
  next();
};