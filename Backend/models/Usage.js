const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
  date: { type: Date, required: true },
  dataUsed: { type: Number, required: true }, // in GB
  peakHours: [{
    hour: Number, // 0-23
    usage: Number // GB used in that hour
  }],
  deviceCount: { type: Number, default: 1 },
  activityTypes: {
    streaming: Number, // GB
    gaming: Number, // GB
    browsing: Number, // GB
    downloads: Number, // GB
    videoConferencing: Number, // GB
    other: Number // GB
  },
  speedTests: [{
    timestamp: Date,
    downloadSpeed: Number, // Mbps
    uploadSpeed: Number, // Mbps
    latency: Number // ms
  }],
  satisfaction: {
    rating: { type: Number, min: 1, max: 5 },
    feedback: String,
    issues: [String] // e.g., ["slow_speed", "frequent_disconnections", "poor_support"]
  },
  createdAt: { type: Date, default: Date.now }
});

// Index for efficient queries
usageSchema.index({ userId: 1, date: -1 });
usageSchema.index({ subscriptionId: 1, date: -1 });

module.exports = mongoose.model('Usage', usageSchema);
