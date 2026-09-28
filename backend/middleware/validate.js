module.exports = (req, res, next) => {
  const { receiverEmail, amount } = req.body;
  const parsed = Number(amount);

  if (
    typeof receiverEmail !== 'string' ||
    !receiverEmail.trim() ||
    !Number.isFinite(parsed) ||
    parsed <= 0 ||
    parsed > 1000000
  ) {
    return res.status(400).json({
      message: 'Invalid or missing fields: receiverEmail and a positive amount are required.',
    });
  }

  req.body.amount = parsed;
  next();
};
