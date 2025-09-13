import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
} from '@mui/material';
import { ViewModule, ViewList } from '@mui/icons-material';
import PlanGrid from '../components/plans/PlanGrid';
import PlanComparison from '../components/plans/PlanComparison';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { planService } from '../services/planService';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price');
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchPlans();
    fetchRecommendations();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await planService.getAllPlans();
      setPlans(data);
    } catch (err) {
      setError('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const data = await planService.getRecommendations();
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    }
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const filteredPlans = plans
    .filter(plan => {
      if (filter === 'all') return true;
      return plan.category === filter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'data':
          return (b.dataQuotaGB || 0) - (a.dataQuotaGB || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return <LoadingSpinner message="Loading plans..." />;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Browse Plans
        </Typography>

        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="view mode"
        >
          <ToggleButton value="grid" aria-label="grid view">
            <ViewModule />
          </ToggleButton>
          <ToggleButton value="compare" aria-label="comparison view">
            <ViewList />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {recommendations.length > 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Recommended for you:</Typography>
            {recommendations.map(planId => {
              const plan = plans.find(p => p.id === planId);
              return plan ? (
                <Chip
                  key={plan.id}
                  label={plan.name}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ) : null;
            })}
          </Box>
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={filter}
              label="Category"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
              <MenuItem value="enterprise">Enterprise</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="data">Data Allowance</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {view === 'grid' ? (
        <PlanGrid 
          plans={filteredPlans} 
          recommendations={recommendations}
          onSubscribe={fetchPlans}
        />
      ) : (
        <PlanComparison 
          plans={filteredPlans}
          recommendations={recommendations}
          onSubscribe={fetchPlans}
        />
      )}
    </Box>
  );
};

export default Plans;
