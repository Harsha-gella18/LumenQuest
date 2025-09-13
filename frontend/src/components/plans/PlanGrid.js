import React from 'react';
import { Grid, Card, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material';
import { planService } from '../../services/planService';

const PlanGrid = ({ plans = [], recommendations = [], onSubscribe }) => {
  const handleSubscribe = async (id) => {
    await planService.subscribe(id);
    onSubscribe?.();
  };

  return (
    <Grid container spacing={3}>
      {plans.map((plan) => (
        <Grid item xs={12} sm={6} md={4} key={plan.id}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{plan.name}</Typography>
                {recommendations.includes(plan.id) && (
                  <Chip label="Recommended" size="small" color="primary" />
                )}
              </Box>
              <Typography variant="h4" sx={{ my: 1 }}>
                ${plan.price}<Typography component="span" variant="subtitle2">/mo</Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {plan.dataQuotaGB ? `${plan.dataQuotaGB} GB data` : 'Unlimited data'}
              </Typography>
              <Box>
                {(plan.features || []).map((f) => (
                  <Typography key={f} variant="body2">• {f}</Typography>
                ))}
              </Box>
            </CardContent>
            <CardActions>
              <Button fullWidth variant="contained" onClick={() => handleSubscribe(plan.id)}>Subscribe</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PlanGrid;
