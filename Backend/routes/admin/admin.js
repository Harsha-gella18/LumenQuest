const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminController');

// Dummy admin auth middleware (replace with real JWT admin check)
const adminAuth = (req, res, next) => {
  // For testing: set admin user
  req.user = { id: 'admin1', role: 'admin' };
  next();
};
router.use(adminAuth);

// --- Plans ---
router.post('/plans', adminController.createPlan);
router.put('/plans/:id', adminController.updatePlan);
router.delete('/plans/:id', adminController.deactivatePlan);

// --- Offers ---
router.post('/offers', adminController.createOffer);
router.put('/offers/:id', adminController.updateOffer);
router.delete('/offers/:id', adminController.deactivateOffer);

// --- Users ---
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);

// --- Analytics ---
router.get('/analytics/active-subscriptions', adminController.activeSubscriptions);
router.get('/analytics/cancelled-subscriptions', adminController.cancelledSubscriptions);
router.get('/analytics/top-plans', adminController.topPlans);
router.get('/analytics/revenue', adminController.revenue);
router.get('/analytics/trends', adminController.trends);

// --- Audit Logs ---
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;