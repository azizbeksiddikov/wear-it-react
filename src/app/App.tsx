import { useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/headers/Navbar';
import HomePage from './screens/homePage';
import useBasket from './hooks/useBasket';
import AuthenticationModal from './components/auth';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/footer';
import '../css/app.css';

import { CircularProgress, Box, Typography } from '@mui/material';

// Lazy load non-critical screens
const HelpPage = lazy(() => import('./screens/helpPage'));
const OrdersPage = lazy(() => import('./screens/ordersPage'));
const ProductsPage = lazy(() => import('./screens/productsPage'));
const UserPage = lazy(() => import('./screens/userPage'));

// Beautiful loading fallback
const PageLoading = () => (
	<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="60vh" gap={2}>
		<CircularProgress size={60} thickness={4} sx={{ color: '#3182ce' }} />
		<Typography variant="h6" sx={{ color: '#4a5568', fontWeight: 500 }}>
			Loading your experience...
		</Typography>
	</Box>
);

function App() {
	const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
	const [signupOpen, setSignupOpen] = useState(false);
	const [loginOpen, setLoginOpen] = useState(false);
	const location = useLocation();
	const [returnPath, setReturnPath] = useState<string>('/');

	/** Handlers */
	const handleSignUpClose = () => setSignupOpen(false);
	const handleLoginOpen = (isOpen: boolean = true) => {
		if (isOpen) {
			// Store current location before opening login modal
			setReturnPath(location.pathname + location.search);
		}
		setLoginOpen(isOpen);
	};
	const handleLoginClose = () => setLoginOpen(false);

	return (
		<>
			<ScrollToTop />
			{/* Header */}
			<Navbar
				cartItems={cartItems}
				onAdd={onAdd}
				onRemove={onRemove}
				onDelete={onDelete}
				onDeleteAll={onDeleteAll}
				setSignupOpen={setSignupOpen}
				setLoginOpen={handleLoginOpen}
			/>
			{/* Main content */}
			<Suspense fallback={<PageLoading />}>
				<Routes>
					{/* TODO: HelpPage */}
					<Route path="/help" element={<HelpPage />} />
					<Route path="/products/*" element={<ProductsPage cartItems={cartItems} onAdd={onAdd} />} />
					<Route path="/orders" element={<OrdersPage />} />
					<Route path="/my-page" element={<UserPage />} />
					<Route path="/" element={<HomePage />} />
				</Routes>
			</Suspense>
			{/* Footer */}
			<Footer />

			<AuthenticationModal
				signupOpen={signupOpen}
				loginOpen={loginOpen}
				handleLoginClose={handleLoginClose}
				handleSignupClose={handleSignUpClose}
				returnPath={returnPath}
			/>
		</>
	);
}

export default App;
