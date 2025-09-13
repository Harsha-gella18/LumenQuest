const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  discountType: { type: String, enum: ['percentage', 'fixed', 'free_months'], required: true },
  discountValue: { type: Number, required: true }, // percentage or fixed amount
  applicablePlans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plan' }],
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  maxUsage: Number, // maximum number of times this offer can be used
  currentUsage: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  conditions: {
    minSubscriptionPeriod: Number, // in months
    newCustomersOnly: { type: Boolean, default: false },
    targetUserSegment: [String] // e.g., ["students", "seniors", "business"]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

offerSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Offer', offerSchema);
