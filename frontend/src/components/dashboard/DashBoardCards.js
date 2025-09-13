import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Subscriptions,
  TrendingUp,
  Payment,
  DataUsage,
} from '@mui/icons-material';

const DashboardCards = ({ data }) => {
  const cards = [
    {
      title: 'Active Subscriptions',
      value: data?.activeSubscriptions || 0,
      icon: <Subscriptions />,
      color: '#1976d2',
      change: data?.subscriptionChange || 0,
    },
    {
      title: 'Monthly Spend',
      value: `$${data?.monthlySpend || 0}`,
      icon: <Payment />,
      color: '#2e7d32',
      change: data?.spendChange || 0,
    },
    {
      title: 'Data Usage',
      value: `${data?.dataUsage || 0}%`,
      icon: <DataUsage />,
      color: '#ed6c02',
      change: data?.usageChange || 0,
    },
    {
      title: 'Savings',
      value: `$${data?.totalSavings || 0}`,
      icon: <TrendingUp />,
      color: '#9c27b0',
      change: data?.savingsChange || 0,
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    {card.title}
                  </Typography>
                  <Typography variant="h4" component="div">
                    {card.value}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Chip
                      label={`${card.change > 0 ? '+' : ''}${card.change}%`}
                      size="small"
                      color={card.change >= 0 ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </Box>
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
    </Grid>
  );
};

export default DashboardCards;
