const Plan = require('../../models/Plan');
const Offer = require('../../models/Offer');
const User = require('../../models/User');
const Subscription = require('../../models/Subscription');
const Payment = require('../../models/Payment');
const AuditLog = require('../../models/AuditLog');

// Dummy admin auth middleware (replace with real JWT admin check)
const isAdmin = (req, res, next) => {
  // Assume req.user is set by auth middleware
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};

// --- Helper: Audit Log ---
const logAudit = async (actorId, role, action, target, metadata) => {
  await AuditLog.create({ actorId, role, action, target, metadata });
};

// --- Plans Management ---

exports.createPlan = async (req, res) => {
  try {
    const plan = new Plan(req.body);
    await plan.save();
    await logAudit(req.user.id, req.user.role, 'CREATE_PLAN', plan._id, { name: plan.name });
    res.status(201).json({ message: 'Plan created successfully', planId: plan._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    await logAudit(req.user.id, req.user.role, 'UPDATE_PLAN', plan._id, req.body);
    res.json({ message: 'Plan updated successfully', planId: plan._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deactivatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    await logAudit(req.user.id, req.user.role, 'DEACTIVATE_PLAN', plan._id, {});
    res.json({ message: 'Plan deactivated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Offers Management ---

exports.createOffer = async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    await logAudit(req.user.id, req.user.role, 'CREATE_OFFER', offer._id, { code: offer.code });
    res.status(201).json({ message: 'Offer created', offerId: offer._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    await logAudit(req.user.id, req.user.role, 'UPDATE_OFFER', offer._id, req.body);
    res.json({ message: 'Offer updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deactivateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    await logAudit(req.user.id, req.user.role, 'DEACTIVATE_OFFER', offer._id, {});
    res.json({ message: 'Offer deactivated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- User Management ---

exports.getUsers = async (req, res) => {
  try {
    const { search, role, isVerified } = req.query;
    const filter = {};
    if (search) filter.fullName = { $regex: search, $options: 'i' };
    if (role) filter.role = role;
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
    const users = await User.find(filter, '_id fullName email role isVerified createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '_id fullName email role preferences isVerified createdAt');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const subscriptions = await Subscription.find({ userId: user._id }).populate('planId');
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      preferences: user.preferences,
      subscriptions: subscriptions.map(sub => ({
        subscriptionId: sub._id,
        planName: sub.planId ? sub.planId.name : null,
        status: sub.status
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const allowed = {};
    if (req.body.role) allowed.role = req.body.role;
    if (req.body.isVerified !== undefined) allowed.isVerified = req.body.isVerified;
    const user = await User.findByIdAndUpdate(req.params.id, allowed, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    await logAudit(req.user.id, req.user.role, 'UPDATE_USER', user._id, allowed);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Analytics ---

exports.activeSubscriptions = async (req, res) => {
  try {
    const count = await Subscription.countDocuments({ status: 'active' });
    res.json({ activeSubscriptions: count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelledSubscriptions = async (req, res) => {
  try {
    const count = await Subscription.countDocuments({ status: 'cancelled' });
    res.json({ cancelledSubscriptions: count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.topPlans = async (req, res) => {
  try {
    const { period } = req.query;
    let match = {};
    if (period === 'monthly') {
      const start = new Date();
      start.setDate(1);
      start.setHours(0,0,0,0);
      match = { subscribedAt: { $gte: start } };
    }
    const agg = await Subscription.aggregate([
      { $match: match },
      { $group: { _id: '$planId', subscriptions: { $sum: 1 } } },
      { $sort: { subscriptions: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'plans',
          localField: '_id',
          foreignField: '_id',
          as: 'plan'
        }
      },
      { $unwind: '$plan' },
      { $project: { planName: '$plan.name', subscriptions: 1 } }
    ]);
    res.json(agg);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.revenue = async (req, res) => {
  try {
    const { month } = req.query;
    let match = {};
    if (month) {
      const [y, m] = month.split('-');
      const start = new Date(Number(y), Number(m)-1, 1);
      const end = new Date(Number(y), Number(m), 1);
      match = { createdAt: { $gte: start, $lt: end }, status: 'success' };
    } else {
      match = { status: 'success' };
    }
    const agg = await Payment.aggregate([
      { $match: match },
      { $group: { _id: null, revenue: { $sum: '$amount' } } }
    ]);
    res.json({ revenue: agg[0]?.revenue || 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.trends = async (req, res) => {
  try {
    // Last 6 months
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ month: d.toLocaleString('default', { month: 'short' }), start: d });
    }
    const results = [];
    for (let i = 0; i < months.length; i++) {
      const start = months[i].start;
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
      const active = await Subscription.countDocuments({
        status: 'active',
        subscribedAt: { $gte: start, $lt: end }
      });
      const cancelled = await Subscription.countDocuments({
        status: 'cancelled',
        subscribedAt: { $gte: start, $lt: end }
      });
      results.push({ month: months[i].month, active, cancelled });
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Audit Logs ---

exports.getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const logs = await AuditLog.find()
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};