import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import PlanManagement from '../components/admin/PlanManagement';
import Analytics from '../components/admin/Analytics';

const Admin = () => {
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Administration
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Dashboard" />
          <Tab label="User Management" />
          <Tab label="Plan Management" />
          <Tab label="Analytics" />
        </Tabs>
      </Box>

      <Box>
        {tab === 0 && <AdminDashboard />}
        {tab === 1 && <UserManagement />}
        {tab === 2 && <PlanManagement />}
        {tab === 3 && <Analytics />}
      </Box>
    </Box>
  );
};

export default Admin;
