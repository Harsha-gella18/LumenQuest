const User = require('../../models/User');
const Payment = require('../../models/Payment');
const Plan = require('../../models/Plan');
const Subscription = require('../../models/Subscription');
const Offer = require('../../models/Offer');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Dummy payment link generator
const generatePaymentLink = (id) => `https://payment.gateway/checkout/${id}`;

// Middleware to get user from JWT (dummy, replace with real auth)
const getUserFromJWT = async (req) => {
  // Example: req.user = { id: ... } set by auth middleware
  // Replace with actual JWT verification logic
  return await User.findById(req.user.id);
};

// --- Payment APIs ---

// POST /payments/initiate
exports.initiatePayment = async (req, res) => {
  try {
    const { planId, duration, gateway } = req.body;
    if (gateway !== 'stripe') {
      return res.status(400).json({ message: 'Only Stripe gateway is supported.' });
    }
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    // Stripe expects amount in paise/cents
    const amount = plan.pricePerMonth * duration * 100;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: { name: plan.name },
          unit_amount: plan.pricePerMonth * 100,
        },
        quantity: duration,
      }],
      mode: 'payment',
      success_url: 'http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/payment-cancel',
      metadata: {
        userId: req.user.id,
        planId,
        duration,
      }
    });

    // Create Payment record (pending)
    const payment = new Payment({
      userId: req.user.id,
      planId,
      amount: plan.pricePerMonth * duration,
      duration,
      status: 'pending',
      paymentGateway: 'stripe',
      transactionId: session.id,
    });
    await payment.save();

    res.json({
      paymentId: payment._id,
      paymentLink: session.url,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /payments/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { transactionId, status } = req.body;
    const payment = await Payment.findOne({ transactionId });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    if (status === 'success') {
      payment.status = 'success';
      await payment.save();

      // Activate subscription
      const subscription = new Subscription({
        userId: payment.userId,
        planId: payment.planId,
        duration: payment.duration,
        status: 'active',
        subscribedAt: new Date(),
        expiresAt: new Date(Date.now() + payment.duration * 30 * 24 * 60 * 60 * 1000),
        paymentId: payment._id,
      });
      await subscription.save();

      // Link payment to subscription
      payment.subscriptionId = subscription._id;
      await payment.save();

      return res.json({
        message: 'Payment verified, subscription activated',
        subscriptionId: subscription._id,
      });
    } else {
      payment.status = 'failed';
      await payment.save();
      return res.status(400).json({ message: 'Payment failed' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /payments/history
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- User Profile APIs ---

exports.getMe = async (req, res) => {
  try {
    const user = await getUserFromJWT(req);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Only return allowed fields
    const {
      _id, fullName, email, phone, preferences, profilePic,
      role, isVerified, createdAt, lastLogin
    } = user;
    res.json({
      _id, fullName, email, phone, preferences, profilePic,
      role, isVerified, createdAt, lastLogin
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const user = await getUserFromJWT(req);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const allowedFields = ['fullName', 'phone', 'preferences', 'profilePic', 'isVerified'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });
    user.updatedAt = new Date();
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Subscription APIs ---

// GET /plans?search=&category=&priceMin=&priceMax
exports.getPlans = async (req, res) => {
  try {
    const { search, category, priceMin, priceMax } = req.query;
    const filter = { isActive: true };

    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    if (priceMin) filter.pricePerMonth = { ...filter.pricePerMonth, $gte: Number(priceMin) };
    if (priceMax) filter.pricePerMonth = { ...filter.pricePerMonth, $lte: Number(priceMax) };

    const plans = await Plan.find(filter);
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /subscriptions
exports.createSubscription = async (req, res) => {
  try {
    const { planId, duration, autoRenew, offerCode } = req.body;
    // Validate plan
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    // Optionally validate offerCode
    let offer = null;
    if (offerCode) {
      offer = await Offer.findOne({ code: offerCode, active: true });
    }

    // Create subscription (status pending until payment)
    const subscription = new Subscription({
      userId: req.user.id,
      planId,
      duration,
      autoRenew,
      status: 'pending'
    });
    await subscription.save();

    res.json({
      subscriptionId: subscription._id,
      status: subscription.status,
      paymentLink: generatePaymentLink(subscription._id)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /subscriptions/cancel
exports.cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const subscription = await Subscription.findOne({ _id: subscriptionId, userId: req.user.id });
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    subscription.status = 'cancelled';
    await subscription.save();

    res.json({
      message: 'Subscription cancelled successfully',
      status: subscription.status
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /subscriptions/renew
exports.renewSubscription = async (req, res) => {
  try {
    const { subscriptionId, duration } = req.body;
    const subscription = await Subscription.findOne({ _id: subscriptionId, userId: req.user.id });
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    // Extend expiry
    const now = new Date();
    subscription.duration = duration;
    subscription.status = 'active';
    subscription.expiresAt = new Date(now.setMonth(now.getMonth() + duration));
    await subscription.save();

    res.json({
      message: 'Subscription renewed',
      newExpiry: subscription.expiresAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /subscriptions/change-plan
exports.changePlan = async (req, res) => {
  try {
    const { subscriptionId, newPlanId, duration } = req.body;
    const subscription = await Subscription.findOne({ _id: subscriptionId, userId: req.user.id });
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    // Create new subscription for new plan
    const newSubscription = new Subscription({
      userId: req.user.id,
      planId: newPlanId,
      duration,
      status: 'active',
      subscribedAt: new Date(),
      expiresAt: new Date(Date.now() + duration * 30 * 24 * 60 * 60 * 1000)
    });
    await newSubscription.save();

    // Optionally cancel old subscription
    subscription.status = 'cancelled';
    await subscription.save();

    res.json({
      message: 'Plan changed successfully',
      subscriptionId: newSubscription._id,
      status: newSubscription.status
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /subscriptions/me
exports.getMySubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.user.id }).populate('planId');
    const result = subs.map(sub => ({
      subscriptionId: sub._id,
      planName: sub.planId.name,
      status: sub.status,
      expiresAt: sub.expiresAt,
      autoRenew: sub.autoRenew
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};