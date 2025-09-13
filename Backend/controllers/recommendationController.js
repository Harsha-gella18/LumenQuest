const geminiService = require('../services/geminiService');
const datasetAnalyzer = require('../services/datasetAnalyzer');
const Plan = require('../models/Plan');
const User = require('../models/User');

// Get plan recommendations for a user based on their usage patterns
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's usage patterns from dataset
    const usageData = datasetAnalyzer.getUserUsagePatterns(userId);
    
    // Get available plans
    const availablePlans = await Plan.find({ isActive: true });
    
    if (availablePlans.length === 0) {
      return res.status(404).json({ message: 'No active plans available' });
    }

    // Generate recommendations using Gemini AI
    const recommendations = await geminiService.generatePlanRecommendations(
      {
        fullName: user.fullName,
        preferences: user.preferences,
        currentPlan: req.body.currentPlan || null
      },
      usageData,
      availablePlans
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email
      },
      recommendations,
      availablePlans: availablePlans.map(plan => ({
        id: plan._id,
        name: plan.name,
        speed: plan.speed,
        price: plan.price,
        duration: plan.duration,
        features: plan.features,
        dataLimit: plan.dataLimit,
        type: plan.type
      }))
    });

  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate recommendations',
      error: error.message 
    });
  }
};

// Get user's usage insights
exports.getUserInsights = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get usage patterns from dataset
    const usageData = datasetAnalyzer.getUserUsagePatterns(userId);
    
    // Get historical data for this user from dataset
    const dataset = datasetAnalyzer.loadDataset();
    const userSubscriptions = dataset.Subscriptions.filter(sub => sub['User Id'] == userId);
    const userBilling = dataset.Billing_Information.filter(bill => 
      userSubscriptions.some(sub => sub['Subscription Id'] == bill.subscription_id)
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email
      },
      usageData,
      subscriptionHistory: userSubscriptions,
      billingHistory: userBilling,
      insights: {
        totalSubscriptions: userSubscriptions.length,
        activeSubscriptions: userSubscriptions.filter(sub => sub.Status === 'active').length,
        totalSpent: userBilling.reduce((sum, bill) => sum + (bill.amount || 0), 0),
        avgMonthlySpend: userBilling.length > 0 ? 
          userBilling.reduce((sum, bill) => sum + (bill.amount || 0), 0) / userBilling.length : 0
      }
    });

  } catch (error) {
    console.error('User insights error:', error);
    res.status(500).json({ 
      message: 'Failed to get user insights',
      error: error.message 
    });
  }
};
