const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/', auth, async (req, res) => {
  const { name } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (name) user.name = name;
    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email, balance: user.balance, stats: user.stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;