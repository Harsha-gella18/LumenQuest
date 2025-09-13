const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  speed: { type: String, required: true }, // e.g., "100 Mbps", "1 Gbps"
  price: { type: Number, required: true },
  duration: { type: String, required: true }, // e.g., "monthly", "yearly"
  features: [String],
  dataLimit: String, // e.g., "unlimited", "500 GB"
  type: { type: String, enum: ['fiber', 'broadband', 'wireless'], required: true },
  isActive: { type: Boolean, default: true },
  targetAudience: [String], // e.g., ["home", "business", "gaming"]
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

planSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Plan', planSchema);
