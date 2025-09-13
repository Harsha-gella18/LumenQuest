const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const auth = require('../middleware/auth');

// Get plan recommendations for authenticated user
router.get('/', auth, recommendationController.getRecommendations);

// Get user usage insights
router.get('/insights', auth, recommendationController.getUserInsights);

module.exports = router;
