import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  Fab,
  Dialog,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import SubscriptionList from 'components/subscriptions/SubscriptionList';
import SubscriptionModal from 'components/subscriptions/SubscriptionModal';
import UsageTracker from 'components/subscriptions/UsageTracker';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { subscriptionService } from 'services/subscriptionService';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getUserSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subscription) => {
    setSelectedSubscription(subscription);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedSubscription(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSubscription(null);
  };

  const handleModalSuccess = () => {
    fetchSubscriptions();
    handleModalClose();
  };

  if (loading) {
    return <LoadingSpinner message="Loading subscriptions..." />;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          My Subscriptions
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Subscription
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <SubscriptionList
            subscriptions={subscriptions}
            onEdit={handleEdit}
            onRefresh={fetchSubscriptions}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <UsageTracker subscriptions={subscriptions} />
        </Grid>
      </Grid>

      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        maxWidth="md"
        fullWidth
      >
        <SubscriptionModal
          subscription={selectedSubscription}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      </Dialog>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleAdd}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default Subscriptions;
