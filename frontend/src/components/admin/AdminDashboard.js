import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import {
  People,
  Subscriptions,
  TrendingUp,
  AttachMoney,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { planService } from '../../services/planService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const data = await planService.getPlanAnalytics();
      setStats(data.stats);
      setChartData(data.chartData);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: <People />,
      color: '#1976d2',
      change: stats.userGrowth || 0,
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions || 0,
      icon: <Subscriptions />,
      color: '#2e7d32',
      change: stats.subscriptionGrowth || 0,
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue || 0}`,
      icon: <AttachMoney />,
      color: '#ed6c02',
      change: stats.revenueGrowth || 0,
    },
    {
      title: 'Growth Rate',
      value: `${stats.growthRate || 0}%`,
      icon: <TrendingUp />,
      color: '#9c27b0',
      change: stats.growthChange || 0,
    },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {card.value}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color={card.change >= 0 ? 'success.main' : 'error.main'}
                    >
                      {card.change >= 0 ? '+' : ''}{card.change}% from last month
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      backgroundColor: card.color,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Trend
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2e7d32"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Subscription Growth */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Subscription Growth
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="subscriptions" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
