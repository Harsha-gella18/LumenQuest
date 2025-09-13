import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
  FormControlLabel,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  AttachMoney,
  DataUsage,
  Star,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';

// Mock data for demonstration
const mockPlans = [
  {
    id: 1,
    name: 'Basic Fibernet',
    description: 'Perfect for light usage and browsing',
    price: 29.99,
    currency: 'USD',
    billingInterval: 'monthly',
    dataQuotaGB: 100,
    category: 'basic',
    isActive: true,
    features: ['High Speed Internet', 'Email Support', '24/7 Uptime'],
    subscribers: 150,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Premium Fibernet',
    description: 'Great for families and heavy users',
    price: 59.99,
    currency: 'USD',
    billingInterval: 'monthly',
    dataQuotaGB: 500,
    category: 'premium',
    isActive: true,
    features: ['Ultra High Speed', 'Priority Support', 'Free Installation', 'Wi-Fi Router'],
    subscribers: 89,
    createdAt: '2024-01-20',
  },
  {
    id: 3,
    name: 'Enterprise Broadband',
    description: 'For business and enterprise needs',
    price: 199.99,
    currency: 'USD',
    billingInterval: 'monthly',
    dataQuotaGB: -1, // Unlimited
    category: 'enterprise',
    isActive: true,
    features: ['Dedicated Support', 'SLA Guarantee', 'Unlimited Data', 'Static IP'],
    subscribers: 25,
    createdAt: '2024-02-01',
  },
];

const validationSchema = yup.object({
  name: yup.string().required('Plan name is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().positive('Price must be positive').required('Price is required'),
  billingInterval: yup.string().required('Billing interval is required'),
  dataQuotaGB: yup.number().min(-1, 'Use -1 for unlimited').required('Data quota is required'),
  category: yup.string().required('Category is required'),
});

const PlanManagement = () => {
  const [plans, setPlans] = useState(mockPlans);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPlan, setMenuPlan] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      currency: 'USD',
      billingInterval: 'monthly',
      dataQuotaGB: '',
      category: 'basic',
      features: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setLoading(true);

        // Process features
        const featuresArray = values.features.split(',').map(f => f.trim()).filter(f => f);

        const planData = {
          ...values,
          features: featuresArray,
          price: parseFloat(values.price),
          dataQuotaGB: parseInt(values.dataQuotaGB),
        };

        if (selectedPlan) {
          // Update plan
          setPlans(prev => 
            prev.map(plan => 
              plan.id === selectedPlan.id 
                ? { ...plan, ...planData }
                : plan
            )
          );
          toast.success('Plan updated successfully');
        } else {
          // Add new plan
          const newPlan = {
            id: plans.length + 1,
            ...planData,
            subscribers: 0,
            createdAt: new Date().toISOString().split('T')[0],
          };
          setPlans(prev => [...prev, newPlan]);
          toast.success('Plan created successfully');
        }

        resetForm();
        setDialogOpen(false);
        setSelectedPlan(null);
      } catch (error) {
        toast.error('Operation failed');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (selectedPlan) {
      formik.setValues({
        name: selectedPlan.name,
        description: selectedPlan.description,
        price: selectedPlan.price,
        currency: selectedPlan.currency,
        billingInterval: selectedPlan.billingInterval,
        dataQuotaGB: selectedPlan.dataQuotaGB,
        category: selectedPlan.category,
        features: selectedPlan.features.join(', '),
        isActive: selectedPlan.isActive,
      });
    }
  }, [selectedPlan]);

  const handleAdd = () => {
    setSelectedPlan(null);
    formik.resetForm();
    setDialogOpen(true);
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = (plan) => {
    setPlans(prev => prev.filter(p => p.id !== plan.id));
    toast.success('Plan deleted successfully');
    handleMenuClose();
  };

  const handleToggleStatus = (plan) => {
    setPlans(prev => 
      prev.map(p => 
        p.id === plan.id 
          ? { ...p, isActive: !p.isActive }
          : p
      )
    );
    toast.success(`Plan ${plan.isActive ? 'deactivated' : 'activated'}`);
    handleMenuClose();
  };

  const handleMenuClick = (event, plan) => {
    setAnchorEl(event.currentTarget);
    setMenuPlan(plan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPlan(null);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'basic': return 'default';
      case 'premium': return 'primary';
      case 'enterprise': return 'secondary';
      default: return 'default';
    }
  };

  const totalPlans = plans.length;
  const activePlans = plans.filter(p => p.isActive).length;
  const totalSubscribers = plans.reduce((sum, p) => sum + p.subscribers, 0);
  const totalRevenue = plans.reduce((sum, p) => sum + (p.price * p.subscribers), 0);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Plan Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Plan
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {totalPlans}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Plans
                  </Typography>
                </Box>
                <Star color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {activePlans}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Active Plans
                  </Typography>
                </Box>
                <Visibility color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {totalSubscribers}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Subscribers
                  </Typography>
                </Box>
                <DataUsage color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    ${totalRevenue.toFixed(0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Monthly Revenue
                  </Typography>
                </Box>
                <AttachMoney color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Plans Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Plans
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Plan Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Data Quota</TableCell>
                  <TableCell>Subscribers</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {plan.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {plan.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={plan.category}
                        color={getCategoryColor(plan.category)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        ${plan.price}/{plan.billingInterval}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {plan.dataQuotaGB === -1 ? 'Unlimited' : `${plan.dataQuotaGB} GB`}
                    </TableCell>
                    <TableCell>{plan.subscribers}</TableCell>
                    <TableCell>
                      <Chip
                        label={plan.isActive ? 'Active' : 'Inactive'}
                        color={plan.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuClick(e, plan)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEdit(menuPlan)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleToggleStatus(menuPlan)}>
          <ListItemIcon>
            {menuPlan?.isActive ? (
              <VisibilityOff fontSize="small" />
            ) : (
              <Visibility fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {menuPlan?.isActive ? 'Deactivate' : 'Activate'}
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDelete(menuPlan)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPlan ? 'Edit Plan' : 'Add New Plan'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Plan Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={formik.values.category}
                    label="Category"
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="basic">Basic</MenuItem>
                    <MenuItem value="premium">Premium</MenuItem>
                    <MenuItem value="enterprise">Enterprise</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  multiline
                  rows={2}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="price"
                  name="price"
                  label="Price"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="billing-label">Billing</InputLabel>
                  <Select
                    labelId="billing-label"
                    id="billingInterval"
                    name="billingInterval"
                    value={formik.values.billingInterval}
                    label="Billing"
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="dataQuotaGB"
                  name="dataQuotaGB"
                  label="Data Quota (GB)"
                  type="number"
                  helperText="Use -1 for unlimited"
                  value={formik.values.dataQuotaGB}
                  onChange={formik.handleChange}
                  error={formik.touched.dataQuotaGB && Boolean(formik.errors.dataQuotaGB)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="features"
                  name="features"
                  label="Features (comma-separated)"
                  placeholder="High Speed Internet, Email Support, 24/7 Uptime"
                  value={formik.values.features}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.isActive}
                      onChange={(e) => formik.setFieldValue('isActive', e.target.checked)}
                      name="isActive"
                    />
                  }
                  label="Active Plan"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={formik.handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : (selectedPlan ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlanManagement;