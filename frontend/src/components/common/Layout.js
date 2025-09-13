import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const drawerWidth = 240;

const Layout = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const [mobileOpen, setMobileOpen] = React.useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen((prev) => !prev);
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<Header onMenuClick={handleDrawerToggle} />

			<Sidebar
				mobileOpen={mobileOpen}
				onMobileClose={handleDrawerToggle}
				isMobile={isMobile}
			/>

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					mt: 8,
				}}
			>
				{/* Push content below AppBar */}
				<Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />
				<Outlet />
			</Box>
		</Box>
	);
};

export default Layout;

