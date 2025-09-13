import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from 'context/AuthContext';

// Components
import Layout from 'components/common/Layout';
import LoadingSpinner from 'components/common/LoadingSpinner';
import ProtectedRoute from 'components/common/ProtectedRoute';

// Pages
import Login from 'pages/Login';
import Register from 'pages/Register';
import Dashboard from 'pages/Dashboard';
import Subscriptions from 'pages/Subscriptions';
import Plans from 'pages/Plans';
import Profile from 'pages/Profile';
import Admin from 'pages/Admin';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to="/dashboard" />} 
        />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="plans" element={<Plans />} />
            <Route path="profile" element={<Profile />} />
            <Route 
              path="admin/*" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Box>
  );
}

export default App;
