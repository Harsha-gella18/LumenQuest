// SubscriptionModal.js
import React, { useState } from 'react';
import { DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { subscriptionService } from '../../services/subscriptionService';
import { toast } from 'react-toastify';

const SubscriptionModal = ({ subscription, onClose, onSuccess }) => {
  const [name, setName] = useState(subscription?.plan?.name || '');
  const [price, setPrice] = useState(subscription?.plan?.price || '');

  const handleSave = async () => {
    try {
      if (subscription) {
        // Edit subscription
        await subscriptionService.updateSubscription(subscription.id, { name, price });
        toast.success('Subscription updated successfully');
      } else {
        // Add subscription
        await subscriptionService.addSubscription({ name, price });
        toast.success('Subscription added successfully');
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Failed to save subscription');
    }
  };

  return (
    <>
      <DialogTitle>{subscription ? 'Edit Subscription' : 'Add Subscription'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
          <TextField
            label="Plan Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </>
  );
};

export default SubscriptionModal;
