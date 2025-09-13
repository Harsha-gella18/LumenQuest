import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  AttachMoney,
  Subscriptions,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Mock data for analytics
const mockAnalyticsData = {
  overview: {
    totalRevenue: 45320,
    revenueGrowth: 12.5,
    totalSubscriptions: 264,
    subscriptionGrowth: 8.3,
    activeUsers: 189,
    userGrowth: -2.1,
    churnRate: 5.2,
    churnChange: -0.8,
  },
  revenueData: [
    { month: 'Jan', revenue: 35000, subscriptions: 220 },
    { month: 'Feb', revenue: 38000, subscriptions: 235 },
    { month: 'Mar', revenue: 41000, subscriptions: 248 },
    { month: 'Apr', revenue: 43000, subscriptions: 252 },
    { month: 'May', revenue: 45000, subscriptions: 260 },
    { month: 'Jun', revenue: 45320, subscriptions: 264 },
  ],
  planDistribution: [
    { name: 'Basic Fibernet', value: 45, color: '#0088FE' },
    { name: 'Premium Fibernet', value: 35, color: '#00C49F' },
    { name: 'Enterprise', value: 20, color: '#FFBB28' },
  ],
  topPlans: [
    { id: 1, name: 'Basic Fibernet', subscribers: 120, revenue: 3598, growth: 8.2 },
    { id: 2, name: 'Premium Fibernet', subscribers: 89, revenue: 5339, growth: 12.5 },
    { id: 3, name: 'Enterprise', subscribers: 25, revenue: 4999, growth: -2.1 },
  ],
  churnAnalysis: [
    { month: 'Jan', churned: 8, retained: 212 },
    { month: 'Feb', churned: 12, retained: 223 },
    { month: 'Mar', churned: 10, retained: 238 },
    { month: 'Apr', churned: 6, retained: 246 },
    { month: 'May', churned: 14, retained: 246 },
    { month: 'Jun', churned: 11, retained: 253 },
  ],
  userActivity: [
    { date: '2024-06-01', activeUsers: 145 },
    { date: '2024-06-02', activeUsers: 158 },
    { date: '2024-06-03', activeUsers: 162 },
    { date: '2024-06-04', activeUsers: 149 },
    { date: '2024-06-05', activeUsers: 173 },
    { date: '2024-06-06', activeUsers: 189 },
    { date: '2024-06-07', activeUsers: 167 },
  ],
};

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('6m');
  const [analyticsData, setAnalyticsData] = useState(mockAnalyticsData);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
    // In a real app, you would fetch new data based on the time range
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value}%`;
  };

  const getGrowthColor = (value) => {
    return value >= 0 ? 'success.main' : 'error.main';
  };

  const getGrowthIcon = (value) => {
    return value >= 0 ? <TrendingUp /> : <TrendingDown />;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Analytics & Insights
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="7d">7 Days</MenuItem>
            <MenuItem value="30d">30 Days</MenuItem>
            <MenuItem value="3m">3 Months</MenuItem>
            <MenuItem value="6m">6 Months</MenuItem>
            <MenuItem value="1y">1 Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" component="div">
                    {formatCurrency(analyticsData.overview.totalRevenue)}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getGrowthIcon(analyticsData.overview.revenueGrowth)}
                    <Typography 
                      variant="body2" 
                      color={getGrowthColor(analyticsData.overview.revenueGrowth)}
                      sx={{ ml: 0.5 }}
                    >
                      {formatPercentage(analyticsData.overview.revenueGrowth)}
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ backgroundColor: 'primary.main', width: 56, height: 56 }}>
                  <AttachMoney />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Subscriptions
                  </Typography>
                  <Typography variant="h4" component="div">
                    {analyticsData.overview.totalSubscriptions}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getGrowthIcon(analyticsData.overview.subscriptionGrowth)}
                    <Typography 
                      variant="body2" 
                      color={getGrowthColor(analyticsData.overview.subscriptionGrowth)}
                      sx={{ ml: 0.5 }}
                    >
                      {formatPercentage(analyticsData.overview.subscriptionGrowth)}
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ backgroundColor: 'success.main', width: 56, height: 56 }}>
                  <Subscriptions />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Active Users
                  </Typography>
                  <Typography variant="h4" component="div">
                    {analyticsData.overview.activeUsers}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getGrowthIcon(analyticsData.overview.userGrowth)}
                    <Typography 
                      variant="body2" 
                      color={getGrowthColor(analyticsData.overview.userGrowth)}
                      sx={{ ml: 0.5 }}
                    >
                      {formatPercentage(analyticsData.overview.userGrowth)}
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ backgroundColor: 'info.main', width: 56, height: 56 }}>
                  <People />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Churn Rate
                  </Typography>
                  <Typography variant="h4" component="div">
                    {analyticsData.overview.churnRate}%
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getGrowthIcon(analyticsData.overview.churnChange)}
                    <Typography 
                      variant="body2" 
                      color={getGrowthColor(analyticsData.overview.churnChange)}
                      sx={{ ml: 0.5 }}
                    >
                      {formatPercentage(analyticsData.overview.churnChange)}
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ backgroundColor: 'warning.main', width: 56, height: 56 }}>
                  <AnalyticsIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Revenue Trend */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue & Subscription Trends
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2e7d32"
                      strokeWidth={2}
                      name="Revenue ($)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="subscriptions"
                      stroke="#1976d2"
                      strokeWidth={2}
                      name="Subscriptions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Plan Distribution */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Plan Distribution
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.planDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Plans */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performing Plans
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Plan</TableCell>
                      <TableCell align="right">Subscribers</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Growth</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.topPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {plan.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{plan.subscribers}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(plan.revenue)}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={formatPercentage(plan.growth)}
                            color={plan.growth >= 0 ? 'success' : 'error'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Churn Analysis */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Churn vs Retention
              </Typography>
              <Box height={200}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.churnAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="retained" stackId="a" fill="#4caf50" name="Retained" />
                    <Bar dataKey="churned" stackId="a" fill="#f44336" name="Churned" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Active Users */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Daily Active Users (Last 7 Days)
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.userActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="activeUsers"
                      stroke="#1976d2"
                      fill="#1976d2"
                      fillOpacity={0.3}
                      name="Active Users"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;