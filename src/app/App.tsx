import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Navbar from './components/headers/Navbar';
import HomePage from './screens/homePage';
import HelpPage from './screens/helpPage';
import OrdersPage from './screens/ordersPage';
import ProductsPage from './screens/productsPage';
import UserPage from './screens/userPage';
import Footer from './components/footer';
import '../css/app.css';

function App() {
	return (
		<div>
			{/* Header */}
			<Navbar />

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
		</div>
	);
}

export default App;
