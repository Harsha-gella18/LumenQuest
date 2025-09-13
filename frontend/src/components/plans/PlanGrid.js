import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
} from '@mui/material';
import { Check, Star } from '@mui/icons-material';
import { subscriptionService } from '../../services/subscriptionService';
import { toast } from 'react-toastify';

const PlanGrid = ({ plans, recommendations, onSubscribe }) => {
  const [loading, setLoading] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ open: false, plan: null });

  const handleSubscribe = async (plan) => {
    try {
      setLoading(prev => ({ ...prev, [plan.id]: true }));
      await subscriptionService.createSubscription({ planId: plan.id });
      toast.success(`Successfully subscribed to ${plan.name}`);
      onSubscribe();
    } catch (error) {
      toast.error('Failed to subscribe to plan');
    } finally {
      setLoading(prev => ({ ...prev, [plan.id]: false }));
      setConfirmDialog({ open: false, plan: null });
    }
  };

  const isRecommended = (planId) => recommendations.includes(planId);

  const formatFeatures = (features) => {
    if (typeof features === 'string') return [features];
    if (Array.isArray(features)) return features;
    if (typeof features === 'object') return Object.values(features);
    return [];
  };

  return (
    <>
      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                ...(isRecommended(plan.id) && {
                  border: '2px solid',
                  borderColor: 'primary.main',
                })
              }}
            >
              {isRecommended(plan.id) && (
                <Chip
                  icon={<Star />}
                  label="Recommended"
                  color="primary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1,
                  }}
                />
              )}

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {plan.name}
                </Typography>

                <Box display="flex" alignItems="baseline" mb={2}>
                  <Typography variant="h4" color="primary">
                    ${plan.price}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                    /{plan.billingInterval}
                  </Typography>
                </Box>

                <Typography variant="body2" color="textSecondary" paragraph>
                  {plan.description}
                </Typography>

                <Box mb={2}>
                  <Typography variant="body2" fontWeight="bold">
                    Data Allowance: {plan.dataQuotaGB ? `${plan.dataQuotaGB} GB` : 'Unlimited'}
                  </Typography>
                </Box>

                {plan.features && (
                  <List dense>
                    {formatFeatures(plan.features).slice(0, 4).map((feature, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature} 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant={isRecommended(plan.id) ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setConfirmDialog({ open: true, plan })}
                  disabled={loading[plan.id]}
                >
                  {loading[plan.id] ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, plan: null })}
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Confirm Subscription
          </Typography>
          <Typography variant="body2" paragraph>
            Are you sure you want to subscribe to {confirmDialog.plan?.name} 
            for ${confirmDialog.plan?.price}/{confirmDialog.plan?.billingInterval}?
          </Typography>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button onClick={() => setConfirmDialog({ open: false, plan: null })}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => handleSubscribe(confirmDialog.plan)}
              disabled={loading[confirmDialog.plan?.id]}
            >
              {loading[confirmDialog.plan?.id] ? 'Processing...' : 'Confirm'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default PlanGrid;
