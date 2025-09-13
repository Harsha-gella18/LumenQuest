import React from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  return (
    <Card>
      <CardHeader title="Profile" />
      <CardContent>
        <Typography>Name: {user?.firstName} {user?.lastName}</Typography>
        <Typography>Email: {user?.email}</Typography>
        <Typography>Role: {user?.role || 'user'}</Typography>
      </CardContent>
    </Card>
  );
};

export default Profile;
