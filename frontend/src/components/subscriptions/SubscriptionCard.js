// src/components/subscriptions/SubscriptionCard.js
import React from 'react';
import { Card, CardContent, Typography, Chip, Box, IconButton } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { format } from 'date-fns';

const SubscriptionCard = ({ subscription, onMenuClick, getStatusColor }) => {
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h6">{subscription.plan.name}</Typography>
              <Chip
                label={subscription.status}
                color={getStatusColor(subscription.status)}
                size="small"
              />
            </Box>

            <Typography variant="body2" color="textSecondary" gutterBottom>
              {subscription.plan.description}
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
              <Box>
                <Typography variant="body2" color="textSecondary">Price</Typography>
                <Typography variant="body1" fontWeight="bold">
                  ${subscription.plan.price}/{subscription.plan.billingInterval}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary">Next Billing</Typography>
                <Typography variant="body1">
                  {subscription.nextBillingDate ? formatDate(subscription.nextBillingDate) : 'N/A'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary">Data Quota</Typography>
                <Typography variant="body1">
                  {subscription.plan.dataQuotaGB ? `${subscription.plan.dataQuotaGB} GB` : 'Unlimited'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary">Auto Renew</Typography>
                <Chip
                  label={subscription.autoRenew ? 'On' : 'Off'}
                  size="small"
                  color={subscription.autoRenew ? 'success' : 'default'}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>

          <IconButton onClick={(e) => onMenuClick(e, subscription)}>
            <MoreVert />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
