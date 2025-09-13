import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Cancel,
  Upgrade,
  Refresh,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { subscriptionService } from '../../services/subscriptionService';
import { toast } from 'react-toastify';

const SubscriptionList = ({ subscriptions, onEdit, onRefresh }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleMenuClick = (event, subscription) => {
    setAnchorEl(event.currentTarget);
    setSelectedSubscription(subscription);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSubscription(null);
  };

  const handleCancel = async () => {
    try {
      await subscriptionService.cancelSubscription(selectedSubscription.id);
      toast.success('Subscription cancelled successfully');
      onRefresh();
    } catch (error) {
      toast.error('Failed to cancel subscription');
    } finally {
      setCancelDialogOpen(false);
      handleMenuClose();
    }
  };

  const handleUpgrade = () => {
    // Navigate to plans page or show upgrade modal
    handleMenuClose();
  };

  const handleRenew = async () => {
    try {
      await subscriptionService.renewSubscription(selectedSubscription.id);
      toast.success('Subscription renewed successfully');
      onRefresh();
    } catch (error) {
      toast.error('Failed to renew subscription');
    } finally {
      handleMenuClose();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'cancelled': return 'error';
      case 'suspended': return 'warning';
      case 'expired': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <>
      <Grid container spacing={3}>
        {subscriptions.map((subscription) => (
          <Grid item xs={12} key={subscription.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Typography variant="h6">
                        {subscription.plan.name}
                      </Typography>
                      <Chip
                        label={subscription.status}
                        color={getStatusColor(subscription.status)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {subscription.plan.description}
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="textSecondary">
                          Price
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          ${subscription.plan.price}/{subscription.plan.billingInterval}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="textSecondary">
                          Next Billing
                        </Typography>
                        <Typography variant="body1">
                          {subscription.nextBillingDate 
                            ? formatDate(subscription.nextBillingDate)
                            : 'N/A'
                          }
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="textSecondary">
                          Data Quota
                        </Typography>
                        <Typography variant="body1">
                          {subscription.plan.dataQuotaGB 
                            ? `${subscription.plan.dataQuotaGB} GB`
                            : 'Unlimited'
                          }
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="textSecondary">
                          Auto Renew
                        </Typography>
                        <Chip
                          label={subscription.autoRenew ? 'On' : 'Off'}
                          size="small"
                          color={subscription.autoRenew ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <IconButton onClick={(e) => handleMenuClick(e, subscription)}>
                    <MoreVert />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => onEdit(selectedSubscription)}>
          <Edit sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleUpgrade}>
          <Upgrade sx={{ mr: 2 }} />
          Upgrade
        </MenuItem>
        <MenuItem onClick={handleRenew}>
          <Refresh sx={{ mr: 2 }} />
          Renew
        </MenuItem>
        <MenuItem onClick={() => setCancelDialogOpen(true)}>
          <Cancel sx={{ mr: 2 }} />
          Cancel
        </MenuItem>
      </Menu>

      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Subscription</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this subscription? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            Keep Subscription
          </Button>
          <Button onClick={handleCancel} color="error" variant="contained">
            Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubscriptionList;
