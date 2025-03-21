const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

router.post('/', auth, async (req, res) => {
  const { coins, price } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.balance += coins;
    await user.save();

    const transaction = new Transaction({
      userId: user._id,
      type: 'credit',
      amount: coins,
    });
    await transaction.save();

    res.json({ balance: user.balance, transaction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;