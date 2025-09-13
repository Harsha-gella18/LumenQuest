import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock API responses when backend is not available
const mockResponses = {
  '/auth/login': (data) => ({
    data: {
      user: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: data.email,
        role: 'user'
      },
      token: 'mock-jwt-token-' + Date.now()
    }
  }),
  '/auth/register': (data) => ({
    data: {
      user: {
        id: '1',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: 'user'
      },
      token: 'mock-jwt-token-' + Date.now()
    }
  }),
  '/auth/verify': () => ({
    data: {
      user: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'user'
      }
    }
  }),
  '/auth/profile': (data) => ({
    data: {
      success: true,
      user: data
    }
  }),
  '/subscriptions': () => ({
    data: [
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
    ]
  }),
  '/dashboard': () => ({
    data: {
      activeSubscriptions: 3,
      subscriptionChange: 5,
      monthlySpend: 120,
      spendChange: -2,
      dataUsage: 62,
      usageChange: 8,
      totalSavings: 45,
      savingsChange: 3,
      usageData: Array.from({ length: 7 }).map((_, i) => ({ 
        date: `Day ${i + 1}`, 
        usage: Math.round(30 + Math.random() * 40) 
      })),
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
    }
  }),
  '/usage': () => ({
    data: [
      { subscriptionId: 'sub_1', used: 32, total: 50 },
      { subscriptionId: 'sub_2', used: 120, total: 200 },
    ]
  }),
  '/plans': () => ({
    data: [
      { id: 'plan_basic', name: 'Basic Plan', category: 'basic', price: 19, dataQuotaGB: 50, features: ['Email support', '50GB data'] },
      { id: 'plan_premium', name: 'Premium Plan', category: 'premium', price: 39, dataQuotaGB: 200, features: ['Priority support', '200GB data', 'Advanced analytics'] },
      { id: 'plan_enterprise', name: 'Enterprise', category: 'enterprise', price: 99, dataQuotaGB: null, features: ['Unlimited data', 'SLA', 'Dedicated manager'] },
    ]
  }),
  '/plans/recommendations': () => ({
    data: ['plan_premium']
  })
  ,
  '/admin/plan-analytics': () => ({
    data: {
      stats: {
        totalUsers: 1240,
        activeSubscriptions: 860,
        monthlyRevenue: 27450,
        growthRate: 12.4,
        userGrowth: 3.1,
        subscriptionGrowth: 4.8,
        revenueGrowth: 6.2,
        growthChange: 1.2,
      },
      chartData: [
        { month: 'Jan', revenue: 18000, subscriptions: 620 },
        { month: 'Feb', revenue: 19500, subscriptions: 640 },
        { month: 'Mar', revenue: 21000, subscriptions: 680 },
        { month: 'Apr', revenue: 23000, subscriptions: 720 },
        { month: 'May', revenue: 25500, subscriptions: 780 },
        { month: 'Jun', revenue: 27450, subscriptions: 860 }
      ]
    }
  })
};

// Override axios methods to provide mock responses
const originalPost = api.post;
const originalGet = api.get;
const originalPut = api.put;
const originalDelete = api.delete;

// Helper function to find mock response for dynamic routes
const findMockResponse = (url) => {
  // Remove the base URL to get the relative path
  const relativePath = url.replace(API_BASE_URL, '');
  
  // Check exact match first
  if (mockResponses[relativePath]) {
    return mockResponses[relativePath];
  }
  
  // Check for dynamic routes
  if (relativePath.startsWith('/subscriptions/') && relativePath.includes('/cancel')) {
    return () => ({ data: { success: true } });
  }
  if (relativePath.startsWith('/subscriptions/') && relativePath.includes('/renew')) {
    return () => ({ data: { success: true } });
  }
  if (relativePath.startsWith('/plans/') && relativePath.includes('/subscribe')) {
    return () => ({ data: { success: true } });
  }
  
  return null;
};

api.post = async (url, data) => {
  try {
    return await originalPost(url, data);
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      const mockResponse = findMockResponse(url);
      if (mockResponse) {
        return mockResponse(data);
      }
      return Promise.reject(error);
    }
    throw error;
  }
};

api.get = async (url, config) => {
  try {
    return await originalGet(url, config);
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
      const mockResponse = findMockResponse(url);
      if (mockResponse) {
        return mockResponse();
      }
      return Promise.reject(error);
    }
    throw error;
  }
};

api.put = async (url, data) => {
  try {
    return await originalPut(url, data);
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.log('Backend not available, using mock response for:', url);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      const mockResponse = findMockResponse(url);
      return mockResponse ? mockResponse(data) : Promise.reject(error);
    }
    throw error;
  }
};

api.delete = async (url) => {
  try {
    return await originalDelete(url);
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.log('Backend not available, using mock response for:', url);
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
      return { data: { success: true } };
    }
    throw error;
  }
};

export default api;
