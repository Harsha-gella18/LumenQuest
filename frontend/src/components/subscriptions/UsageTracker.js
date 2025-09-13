import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  LinearProgress,
  Box,
  Chip,
  List,
  ListItem,
} from '@mui/material';
import {
  DataUsage,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { subscriptionService } from 'services/subscriptionService';

const UsageTracker = ({ subscriptions }) => {
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subscriptions.length > 0) {
      fetchUsageData();
    }
  }, [subscriptions]);

  const fetchUsageData = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getUsageData();
      setUsageData(data);
    } catch (error) {
      console.error('Failed to fetch usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'error';
    if (percentage >= 70) return 'warning';
    return 'primary';
  };

  const getUsageIcon = (percentage) => {
    if (percentage >= 90) return <Warning color="error" />;
    if (percentage >= 70) return <Warning color="warning" />;
    return <CheckCircle color="success" />;
  };

  return (
    <Card>
      <CardHeader title="Data Usage" />
      <CardContent>
        {loading && <LinearProgress sx={{ mb: 2 }} />}

        <List>
          {subscriptions.map((subscription) => {
            const usage = usageData.find(u => u.subscriptionId === subscription.id);
            const usagePercentage = usage ? (usage.used / usage.total) * 100 : 0;

            return (
              <ListItem key={subscription.id} sx={{ px: 0 }}>
                <Box width="100%">
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle2">
                      {subscription.plan.name}
                    </Typography>
                    <Chip
                      icon={getUsageIcon(usagePercentage)}
                      label={`${Math.round(usagePercentage)}%`}
                      size="small"
                      color={getUsageColor(usagePercentage)}
                      variant="outlined"
                    />
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={Math.min(usagePercentage, 100)}
                    color={getUsageColor(usagePercentage)}
                    sx={{ mb: 1 }}
                  />

                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">
                      Used: {usage?.used || 0} GB
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total: {usage?.total || subscription.plan.dataQuotaGB || 'Unlimited'}
                      {usage?.total && ' GB'}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            );
          })}
        </List>

        {subscriptions.length === 0 && (
          <Box textAlign="center" py={4}>
            <DataUsage sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body2" color="textSecondary">
              No active subscriptions to track
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageTracker;
