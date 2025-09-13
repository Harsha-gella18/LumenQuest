import api from './api';

// Plan-related service APIs used across the app
export const planService = {
  // Fetch all available plans
  getAllPlans: async () => {
    const response = await api.get('/plans');
    return response.data;
  },

  // Fetch recommended plan IDs for the current user
  getRecommendations: async () => {
    const response = await api.get('/plans/recommendations');
    return response.data;
  },

  // Subscribe to a plan by ID
  subscribe: async (planId) => {
    const response = await api.post(`/plans/${planId}/subscribe`);
    return response.data;
  },

  // Admin: Get plan analytics for dashboard
  getPlanAnalytics: async () => {
    const response = await api.get('/admin/plan-analytics');
    return response.data;
  },
};

