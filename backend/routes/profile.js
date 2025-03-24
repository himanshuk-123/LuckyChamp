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
  const { name, balance, stats } = req.body; // Balance aur stats bhi accept karo
  try {
    const user = await User.findById(req.user.id);
    if (name) user.name = name;
    if (balance !== undefined) user.balance = balance; // Balance update
    if (stats) {
      if (stats.wins !== undefined) user.stats.wins = stats.wins;
      if (stats.losses !== undefined) user.stats.losses = stats.losses;
      if (stats.coinsEarned !== undefined) user.stats.coinsEarned = stats.coinsEarned;
    }
    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email, balance: user.balance, stats: user.stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;