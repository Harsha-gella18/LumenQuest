import api from './api';

// Minimal service layer to unblock UI. Replace endpoints with real backend routes.
export const subscriptionService = {
  async getDashboardData() {
    // Try backend; if it fails, return mocked data so UI renders.
    try {
      const { data } = await api.get('/dashboard');
      return data;
    } catch (e) {
      // Fallback mock
      return {
        activeSubscriptions: 3,
        subscriptionChange: 5,
        monthlySpend: 120,
        spendChange: -2,
        dataUsage: 62,
        usageChange: 8,
        totalSavings: 45,
        savingsChange: 3,
        usageData: Array.from({ length: 7 }).map((_, i) => ({ date: `Day ${i + 1}`, usage: Math.round(30 + Math.random() * 40) })),
        spendingData: [
          { month: 'Jan', amount: 100 },
          { month: 'Feb', amount: 110 },
          { month: 'Mar', amount: 95 },
          { month: 'Apr', amount: 105 },
          { month: 'May', amount: 120 },
          { month: 'Jun', amount: 118 },
        ],
        planDistribution: [
          { name: 'Basic', value: 2 },
          { name: 'Premium', value: 1 },
        ],
        recentActivities: [
          { id: 1, type: 'renewal', message: 'Premium plan renewed', date: new Date().toISOString() },
          { id: 2, type: 'usage', message: 'Data usage reached 70%', date: new Date().toISOString() },
        ],
      };
    }
  },

  async getUserSubscriptions() {
    try {
      const { data } = await api.get('/subscriptions');
      return data;
    } catch (e) {
      // Mocked list
      return [
        {
          id: 'sub_1',
          status: 'active',
          autoRenew: true,
          nextBillingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
          plan: {
            id: 'plan_basic',
            name: 'Basic Plan',
            description: 'Good for light usage',
            price: 19,
            billingInterval: 'mo',
            dataQuotaGB: 50,
          },
        },
        {
          id: 'sub_2',
          status: 'active',
          autoRenew: false,
          nextBillingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
          plan: {
            id: 'plan_premium',
            name: 'Premium Plan',
            description: 'For power users',
            price: 39,
            billingInterval: 'mo',
            dataQuotaGB: 200,
          },
        },
      ];
    }
  },

  async getUsageData() {
    try {
      const { data } = await api.get('/subscriptions/usage');
      return data;
    } catch (e) {
      return [
        { subscriptionId: 'sub_1', used: 32, total: 50 },
        { subscriptionId: 'sub_2', used: 120, total: 200 },
      ];
    }
  },

  async cancelSubscription(id) {
    await api.post(`/subscriptions/${id}/cancel`);
  },

  async renewSubscription(id) {
    await api.post(`/subscriptions/${id}/renew`);
  },
};
