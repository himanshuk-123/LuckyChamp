const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 100 },
  stats: {
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    coinsEarned: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model('User', userSchema);