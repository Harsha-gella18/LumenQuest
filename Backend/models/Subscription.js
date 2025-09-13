const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  duration: { type: Number, required: true },
  status: { type: String, enum: ['active', 'cancelled', 'expired', 'pending'], default: 'active' },
  subscribedAt: { type: Date, default: Date.now },
  expiresAt: Date,
  autoRenew: { type: Boolean, default: false },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);