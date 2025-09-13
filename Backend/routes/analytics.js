const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// Admin analytics dashboard
router.get('/dashboard', auth, analyticsController.getAnalyticsDashboard);

// Subscription analytics
router.get('/subscriptions', auth, analyticsController.getSubscriptionAnalytics);

// Revenue analytics
router.get('/revenue', auth, analyticsController.getRevenueAnalytics);

// Customer insights
router.get('/customers', auth, analyticsController.getCustomerInsights);

module.exports = router;
