const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Basic', 'Premium', 'Add-on'], required: true },
  description: String,
  pricePerMonth: { type: Number, required: true },
  channels: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', planSchema);