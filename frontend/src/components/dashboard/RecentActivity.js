import React from 'react';
import { Card, CardHeader, CardContent, List, ListItem, ListItemText, Chip, Box } from '@mui/material';
import { format } from 'date-fns';

const typeColor = (type) => {
  switch (type) {
    case 'renewal':
      return 'success';
    case 'usage':
      return 'warning';
    case 'cancellation':
      return 'error';
    default:
      return 'default';
  }
};

const RecentActivity = ({ activities = [] }) => {
  return (
    <Card>
      <CardHeader title="Recent Activity" />
      <CardContent>
        <List>
          {activities.map((a) => (
            <ListItem key={a.id} sx={{ px: 0 }}>
              <ListItemText
                primary={a.message}
                secondary={a.date ? format(new Date(a.date), 'PPpp') : ''}
              />
              <Box>
                <Chip label={a.type} size="small" color={typeColor(a.type)} />
              </Box>
            </ListItem>
          ))}
          {activities.length === 0 && (
            <Box color="text.secondary">No recent activity</Box>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
