import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import Navbar from './components/headers/Navbar';
import HomePage from './screens/homePage';
import HelpPage from './screens/helpPage';
import OrdersPage from './screens/ordersPage';
import ProductsPage from './screens/productsPage';
import UserPage from './screens/userPage';
import Footer from './components/footer';
import useBasket from './hooks/useBasket';
import AuthenticationModal from './components/auth';
import '../css/app.css';

function App() {
	const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
	const [signupOpen, setSignupOpen] = useState(false);
	const [loginOpen, setLoginOpen] = useState(false);

	/** Handlers */
	const handleSignUpClose = () => setSignupOpen(false);
	const handleLoginClose = () => setLoginOpen(false);

	return (
		<>
			{/* Header */}
			<Navbar
				cartItems={cartItems}
				onAdd={onAdd}
				onRemove={onRemove}
				onDelete={onDelete}
				onDeleteAll={onDeleteAll}
				setSignupOpen={setSignupOpen}
				setLoginOpen={setLoginOpen}
			/>
			{/* Main content */}
			<Switch>
				{/* TODO: HelpPage */}
				<Route path="/help" component={HelpPage} />
				<Route path="/products">
					<ProductsPage cartItems={cartItems} onAdd={onAdd} />
				</Route>
				<Route path="/orders" component={OrdersPage} />
				<Route path="/my-page" component={UserPage} />
				<Route path="/" component={HomePage} />
			</Switch>
			{/* Footer */}
			<Footer />

			<AuthenticationModal
				signupOpen={signupOpen}
				loginOpen={loginOpen}
				handleLoginClose={handleLoginClose}
				handleSignupClose={handleSignUpClose}
			/>
		</>
	);
}

export default App;
