const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: String,
  discountPercent: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  active: { type: Boolean, default: true },
  applicablePlans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plan' }]
});

module.exports = mongoose.model('Offer', offerSchema);