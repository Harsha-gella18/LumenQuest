import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const DashboardCharts = ({ data }) => {
  const [usageTimeframe, setUsageTimeframe] = useState('7d');

  const usageData = data?.usageData || [];
  const spendingData = data?.spendingData || [];
  const planDistribution = data?.planDistribution || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Grid container spacing={3}>
      {/* Usage Over Time */}
      <Grid item xs={12} lg={6}>
        <Card>
          <CardHeader
            title="Data Usage Over Time"
            action={
              <FormControl size="small">
                <Select
                  value={usageTimeframe}
                  onChange={(e) => setUsageTimeframe(e.target.value)}
                >
                  <MenuItem value="7d">7 Days</MenuItem>
                  <MenuItem value="30d">30 Days</MenuItem>
                  <MenuItem value="90d">90 Days</MenuItem>
                </Select>
              </FormControl>
            }
          />
          <CardContent>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="usage"
                    stroke="#1976d2"
                    fill="#1976d2"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Spending Trend */}
      <Grid item xs={12} lg={6}>
        <Card>
          <CardHeader title="Monthly Spending Trend" />
          <CardContent>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#2e7d32"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Plan Distribution */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Subscription Plan Distribution" />
          <CardContent>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardCharts;
