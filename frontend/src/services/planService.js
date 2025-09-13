import api from './api';

export const planService = {
  async getAllPlans() {
    try {
      const { data } = await api.get('/plans');
      return data;
    } catch (e) {
      // Mock plans
      return [
        { id: 'plan_basic', name: 'Basic Plan', category: 'basic', price: 19, dataQuotaGB: 50, features: ['Email support', '50GB data'] },
        { id: 'plan_premium', name: 'Premium Plan', category: 'premium', price: 39, dataQuotaGB: 200, features: ['Priority support', '200GB data', 'Advanced analytics'] },
        { id: 'plan_enterprise', name: 'Enterprise', category: 'enterprise', price: 99, dataQuotaGB: null, features: ['Unlimited data', 'SLA', 'Dedicated manager'] },
      ];
    }
  },

  async getRecommendations() {
    try {
      const { data } = await api.get('/plans/recommendations');
      return data; // array of plan ids
    } catch (e) {
      return ['plan_premium'];
    }
  },

  async subscribe(planId) {
    await api.post(`/plans/${planId}/subscribe`);
  },
};
