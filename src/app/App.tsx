import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import HomeNavbar from './components/headers/HomeNavbar';
import OtherNavbar from './components/headers/OtherNavbar';
import HomePage from './screens/homePage';
import HelpPage from './screens/helpPage';
import OrdersPage from './screens/ordersPage';
import ProductsPage from './screens/productsPage';
import UserPage from './screens/userPage';
import Footer from './components/footer';
import '../css/app.css';

function App() {
	const location = useLocation();

	return (
		<>
			{/* Header */}
			{location.pathname === '/' ? <HomeNavbar /> : <OtherNavbar />}

			{/* Main content */}
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route path="/help" component={HelpPage} />
				<Route path="/products" component={ProductsPage} />
				<Route path="/orders" component={OrdersPage} />
				<Route path="/member-page" component={UserPage} />
			</Switch>

			{/* Footer */}
			<Footer />
		</>
	);
}

export default App;
