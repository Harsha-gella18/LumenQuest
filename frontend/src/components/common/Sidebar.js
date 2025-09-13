import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  Subscriptions,
  ViewList,
  Person,
  AdminPanelSettings,
  Analytics,
} from '@mui/icons-material';
import { useAuth } from 'context/AuthContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'My Subscriptions', icon: <Subscriptions />, path: '/subscriptions' },
  { text: 'Browse Plans', icon: <ViewList />, path: '/plans' },
  { text: 'Profile', icon: <Person />, path: '/profile' },
];

const adminMenuItems = [
  { text: 'Admin Dashboard', icon: <AdminPanelSettings />, path: '/admin' },
  { text: 'Analytics', icon: <Analytics />, path: '/admin/analytics' },
];

const Sidebar = ({ mobileOpen, onMobileClose, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onMobileClose();
    }
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          SubManager
        </Typography>
      </Toolbar>
      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {user?.role === 'admin' && (
        <>
          <Divider />
          <List>
            <ListItem>
              <ListItemText 
                primary="Administration" 
                sx={{ 
                  '& .MuiTypography-root': { 
                    fontSize: '0.875rem', 
                    fontWeight: 600,
                    color: 'text.secondary'
                  } 
                }} 
              />
            </ListItem>
            {adminMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
