import React from 'react';
import { DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

const SubscriptionModal = ({ subscription, onClose, onSuccess }) => {
  const handleSave = () => {
    // Placeholder save; hook up to API as needed
    onSuccess?.();
  };

  return (
    <>
      <DialogTitle>{subscription ? 'Edit Subscription' : 'Add Subscription'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
          <TextField label="Plan Name" defaultValue={subscription?.plan?.name || ''} fullWidth />
          <TextField label="Price" type="number" defaultValue={subscription?.plan?.price || ''} fullWidth />
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
