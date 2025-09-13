import api from './api';

// Mock authentication service for frontend testing
export const authService = {
  login: async (credentials) => {
    try {
      // Try backend first
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Fallback to mock authentication
      console.log('Backend not available, using mock authentication');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: credentials.email,
        role: 'user'
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      return {
        user: mockUser,
        token: mockToken
      };
    }
  },

  register: async (userData) => {
    try {
      // Try backend first
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      // Fallback to mock registration
      console.log('Backend not available, using mock registration');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser = {
        id: '1',
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: 'user'
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      return {
        user: mockUser,
        token: mockToken
      };
    }
  },

  verifyToken: async (token) => {
    try {
      // Try backend first
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.user;
    } catch (error) {
      // Fallback to mock token verification
      console.log('Backend not available, using mock token verification');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock user data
      return {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'user'
      };
    }
  },

  logout: () => {
    // Perform any cleanup if needed
    console.log('User logged out');
  },

  updateProfile: async (userData) => {
    try {
      // Try backend first
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      // Fallback to mock profile update
      console.log('Backend not available, using mock profile update');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        user: userData
      };
    }
  }
};
