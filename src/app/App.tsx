import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/headers/Navbar';
import HomePage from './screens/homePage';
import HelpPage from './screens/helpPage';
import OrdersPage from './screens/ordersPage';
import ProductsPage from './screens/productsPage';
import UserPage from './screens/userPage';
import Footer from './components/footer';
import ScrollToTop from './components/ScrollToTop';
import useBasket from './hooks/useBasket';
import AuthenticationModal from './components/auth';
import '../css/app.css';

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
			<Routes>
				{/* TODO: HelpPage */}
				<Route path="/help" element={<HelpPage />} />
				<Route path="/products" element={<ProductsPage cartItems={cartItems} onAdd={onAdd} />} />
				<Route path="/orders" element={<OrdersPage />} />
				<Route path="/my-page" element={<UserPage />} />
				<Route path="/" element={<HomePage />} />
			</Routes>
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
