const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const signToken = (user) =>
  jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET || 'jwt_secret_key',
    { expiresIn: '1h' }
  );

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    // Password is hashed by the User model's pre-save hook
    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password,
    });

    const token = signToken(user);
    res.status(201).json({ message: 'User created successfully', token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (!(await user.matchPassword(password || ''))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Current authenticated user (balance, profile)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
