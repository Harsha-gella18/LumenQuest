// src/components/subscription/SubscriptionList.js
import React, { useState } from 'react';
import {
  Grid,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { Edit, Cancel, Upgrade, Refresh } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { subscriptionService } from '../../services/subscriptionService';
import SubscriptionCard from './SubscriptionCard';

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
      case 'active':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'suspended':
        return 'warning';
      case 'expired':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {subscriptions.map((subscription) => (
          <Grid item xs={12} key={subscription.id}>
            <SubscriptionCard
              subscription={subscription}
              onMenuClick={handleMenuClick}
              getStatusColor={getStatusColor}
            />
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
            Are you sure you want to cancel this subscription? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Keep Subscription</Button>
          <Button onClick={handleCancel} color="error" variant="contained">
            Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubscriptionList;
