import api from './api';

export const subscriptionService = {
  // Get user subscriptions
  getUserSubscriptions: async () => {
    const response = await api.get('/subscriptions');
    return response.data;
  },

  // Create new subscription
  createSubscription: async (subscriptionData) => {
    const response = await api.post('/subscriptions', subscriptionData);
    return response.data;
  },

  // Update subscription
  updateSubscription: async (id, subscriptionData) => {
    const response = await api.put(`/subscriptions/${id}`, subscriptionData);
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async (id) => {
    const response = await api.delete(`/subscriptions/${id}`);
    return response.data;
  },

  // Renew subscription
  renewSubscription: async (id) => {
    const response = await api.post(`/subscriptions/${id}/renew`);
    return response.data;
  },

  // Get dashboard data
  getDashboardData: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  // Get usage data
  getUsageData: async () => {
    const response = await api.get('/usage');
    return response.data;
  },

  // Get subscription analytics
  getAnalytics: async (timeframe = '30d') => {
    const response = await api.get(`/analytics?timeframe=${timeframe}`);
    return response.data;
  }
};
