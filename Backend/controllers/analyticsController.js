const geminiService = require('../services/geminiService');
const datasetAnalyzer = require('../services/datasetAnalyzer');
const User = require('../models/User');

// Admin analytics dashboard - comprehensive business insights
exports.getAnalyticsDashboard = async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { timeframe = '30d' } = req.query;
    
    // Load and analyze dataset
    const dataset = datasetAnalyzer.loadDataset();
    
    // Process historical data for analytics
    const analyticsData = processHistoricalData(dataset, timeframe);
    
    // Generate AI insights using Gemini
    const aiInsights = await geminiService.generateAnalyticsInsights(analyticsData, timeframe);
    
    res.json({
      success: true,
      timeframe,
      analytics: analyticsData,
      aiInsights,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analytics dashboard error:', error);
    res.status(500).json({ 
      message: 'Failed to generate analytics dashboard',
      error: error.message 
    });
  }
};

// Get subscription analytics
exports.getSubscriptionAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const dataset = datasetAnalyzer.loadDataset();
    
    const subscriptionAnalytics = {
      totalSubscriptions: dataset.Subscriptions.length,
      activeSubscriptions: dataset.Subscriptions.filter(sub => sub.Status === 'active').length,
      pausedSubscriptions: dataset.Subscriptions.filter(sub => sub.Status === 'PAUSED').length,
      
      subscriptionTypes: getSubscriptionTypeBreakdown(dataset.Subscriptions),
      planPerformance: getPlanPerformance(dataset),
      revenueAnalytics: getRevenueAnalytics(dataset),
      churnAnalysis: getChurnAnalysis(dataset)
    };

    res.json({
      success: true,
      subscriptionAnalytics,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Subscription analytics error:', error);
    res.status(500).json({ 
      message: 'Failed to generate subscription analytics',
      error: error.message 
    });
  }
};

// Get revenue analytics
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const dataset = datasetAnalyzer.loadDataset();
    const revenueData = getDetailedRevenueAnalytics(dataset);

    res.json({
      success: true,
      revenueAnalytics: revenueData,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({ 
      message: 'Failed to generate revenue analytics',
      error: error.message 
    });
  }
};

// Get customer insights
exports.getCustomerInsights = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const dataset = datasetAnalyzer.loadDataset();
    const customerInsights = getCustomerAnalytics(dataset);

    res.json({
      success: true,
      customerInsights,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Customer insights error:', error);
    res.status(500).json({ 
      message: 'Failed to generate customer insights',
      error: error.message 
    });
  }
};

// Helper functions
function processHistoricalData(dataset, timeframe) {
  const totalCustomers = dataset.User_Data.length;
  const totalSubscriptions = dataset.Subscriptions.length;
  const totalRevenue = dataset.Billing_Information.reduce((sum, bill) => sum + (bill.amount || 0), 0);
  const avgUsagePerCustomer = totalRevenue / totalCustomers;
  
  const planPerformance = getPlanPerformance(dataset);
  const customerSegments = getCustomerSegments(dataset);
  
  return {
    totalCustomers,
    totalSubscriptions,
    totalRevenue,
    avgUsagePerCustomer,
    avgSatisfaction: 4.2, // Mock data - could be calculated from actual satisfaction data
    planPerformance,
    customerSegments,
    issues: getIssuesAnalysis(dataset)
  };
}

function getSubscriptionTypeBreakdown(subscriptions) {
  const breakdown = {};
  subscriptions.forEach(sub => {
    const type = sub['Subscription Type'];
    breakdown[type] = (breakdown[type] || 0) + 1;
  });
  return breakdown;
}

function getPlanPerformance(dataset) {
  const planMap = new Map();
  
  // Create plan lookup
  dataset.Subscription_Plans.forEach(plan => {
    planMap.set(plan['Product Id'], {
      name: plan.Name,
      price: plan.Price,
      subscribers: 0,
      revenue: 0,
      avgUsage: 0
    });
  });

  // Count subscribers per plan
  dataset.Subscriptions.forEach(sub => {
    const planId = sub['Product Id'];
    if (planMap.has(planId)) {
      planMap.get(planId).subscribers++;
    }
  });

  // Calculate revenue per plan
  dataset.Billing_Information.forEach(bill => {
    const subscription = dataset.Subscriptions.find(sub => sub['Subscription Id'] == bill.subscription_id);
    if (subscription) {
      const planId = subscription['Product Id'];
      if (planMap.has(planId)) {
        planMap.get(planId).revenue += bill.amount || 0;
      }
    }
  });

  return Array.from(planMap.values());
}

function getRevenueAnalytics(dataset) {
  const totalRevenue = dataset.Billing_Information.reduce((sum, bill) => sum + (bill.amount || 0), 0);
  const paidBills = dataset.Billing_Information.filter(bill => bill.payment_status === 'paid');
  const paidRevenue = paidBills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
  
  return {
    totalRevenue,
    paidRevenue,
    pendingRevenue: totalRevenue - paidRevenue,
    paymentSuccessRate: (paidBills.length / dataset.Billing_Information.length) * 100,
    avgBillAmount: totalRevenue / dataset.Billing_Information.length
  };
}

function getDetailedRevenueAnalytics(dataset) {
  const monthlyRevenue = {};
  const planRevenue = {};
  
  dataset.Billing_Information.forEach(bill => {
    const date = new Date(bill.billing_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (bill.amount || 0);
    
    // Get plan for this billing
    const subscription = dataset.Subscriptions.find(sub => sub['Subscription Id'] == bill.subscription_id);
    if (subscription) {
      const plan = dataset.Subscription_Plans.find(p => p['Product Id'] == subscription['Product Id']);
      if (plan) {
        planRevenue[plan.Name] = (planRevenue[plan.Name] || 0) + (bill.amount || 0);
      }
    }
  });

  return {
    monthlyRevenue,
    planRevenue,
    totalRevenue: Object.values(monthlyRevenue).reduce((sum, val) => sum + val, 0),
    avgMonthlyRevenue: Object.values(monthlyRevenue).reduce((sum, val) => sum + val, 0) / Object.keys(monthlyRevenue).length
  };
}

function getChurnAnalysis(dataset) {
  const totalUsers = dataset.User_Data.length;
  const activeUsers = dataset.User_Data.filter(user => user.Status === 'active').length;
  const inactiveUsers = totalUsers - activeUsers;
  
  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    churnRate: (inactiveUsers / totalUsers) * 100,
    retentionRate: (activeUsers / totalUsers) * 100
  };
}

function getCustomerSegments(dataset) {
  const segments = [
    { type: 'Active Subscribers', count: dataset.User_Data.filter(u => u.Status === 'active').length, avgRevenue: 250 },
    { type: 'Inactive Users', count: dataset.User_Data.filter(u => u.Status === 'inactive').length, avgRevenue: 0 },
    { type: 'High Value', count: 15, avgRevenue: 500 },
    { type: 'Regular Users', count: 60, avgRevenue: 200 }
  ];
  
  return segments;
}

function getCustomerAnalytics(dataset) {
  const userStatusBreakdown = {};
  dataset.User_Data.forEach(user => {
    userStatusBreakdown[user.Status] = (userStatusBreakdown[user.Status] || 0) + 1;
  });

  const subscriptionStatusBreakdown = {};
  dataset.Subscriptions.forEach(sub => {
    subscriptionStatusBreakdown[sub.Status] = (subscriptionStatusBreakdown[sub.Status] || 0) + 1;
  });

  return {
    totalCustomers: dataset.User_Data.length,
    userStatusBreakdown,
    subscriptionStatusBreakdown,
    customerLifetimeValue: calculateCLV(dataset),
    topCustomers: getTopCustomers(dataset)
  };
}

function calculateCLV(dataset) {
  const totalRevenue = dataset.Billing_Information.reduce((sum, bill) => sum + (bill.amount || 0), 0);
  const totalCustomers = dataset.User_Data.length;
  return totalRevenue / totalCustomers;
}

function getTopCustomers(dataset) {
  const customerRevenue = new Map();
  
  dataset.Billing_Information.forEach(bill => {
    const subscription = dataset.Subscriptions.find(sub => sub['Subscription Id'] == bill.subscription_id);
    if (subscription) {
      const userId = subscription['User Id'];
      const user = dataset.User_Data.find(u => u['User Id'] == userId);
      if (user) {
        const current = customerRevenue.get(userId) || { name: user.Name, email: user.Email, revenue: 0 };
        current.revenue += bill.amount || 0;
        customerRevenue.set(userId, current);
      }
    }
  });

  return Array.from(customerRevenue.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
}

function getIssuesAnalysis(dataset) {
  // Mock issues analysis based on subscription logs
  const issues = [
    { type: 'Payment Failures', count: 12, resolution: 85 },
    { type: 'Service Interruptions', count: 8, resolution: 95 },
    { type: 'Plan Changes', count: 25, resolution: 100 },
    { type: 'Billing Disputes', count: 5, resolution: 80 }
  ];
  
  return issues;
}

module.exports = exports;
