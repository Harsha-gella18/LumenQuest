const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users/userController');

const auth = (req, res, next) => {
  req.user = { id: req.header('x-user-id') };
  next();
};

router.get('/me', auth, userController.getMe);
router.put('/me', auth, userController.updateMe);
router.get('/plans', auth, userController.getPlans);
router.post('/subscriptions', auth, userController.createSubscription);
router.put('/subscriptions/cancel', auth, userController.cancelSubscription);
router.put('/subscriptions/renew', auth, userController.renewSubscription);
router.put('/subscriptions/change-plan', auth, userController.changePlan);
router.get('/subscriptions/me', auth, userController.getMySubscriptions);
router.post('/payments/initiate', auth, userController.initiatePayment);
router.post('/payments/verify', auth, userController.verifyPayment);
router.get('/payments/history', auth, userController.getPaymentHistory);

module.exports = router;