const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

router.post('/win', auth, async (req, res) => {
  const { game, amount } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.balance += amount;
    user.stats.wins += 1;
    user.stats.coinsEarned += amount;
    await user.save();

    const transaction = new Transaction({
      userId: user._id,
      type: 'credit',
      amount,
    });
    await transaction.save();

    res.json({ balance: user.balance, stats: user.stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/loss', auth, async (req, res) => {
  const { game, amount } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });
    user.balance -= amount;
    user.stats.losses += 1;
    await user.save();

    const transaction = new Transaction({
      userId: user._id,
      type: 'debit',
      amount,
    });
    await transaction.save();

    res.json({ balance: user.balance, stats: user.stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;