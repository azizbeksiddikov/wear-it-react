import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import Navbar from './components/headers/Navbar';
import HomePage from './screens/homePage';
import HelpPage from './screens/helpPage';
import OrdersPage from './screens/ordersPage';
import ProductsPage from './screens/productsPage';
import UserPage from './screens/userPage';
import Footer from './components/footer';
import useBasket from './hooks/useBasket';

import '../css/app.css';

function App() {
	const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();

	return (
		<div>
			{/* Header */}
			<Navbar cartItems={cartItems} onAdd={onAdd} onRemove={onRemove} onDelete={onDelete} onDeleteAll={onDeleteAll} />

			{/* Main content */}
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route path="/help" component={HelpPage} />
				{/* <Route path="/products" component={ProductsPage} /> */}
				<Route path="/products">
					<ProductsPage
						cartItems={cartItems}
						onAdd={onAdd}
						onRemove={onRemove}
						onDelete={onDelete}
						onDeleteAll={onDeleteAll}
					/>
				</Route>
				<Route path="/orders" component={OrdersPage} />
				<Route path="/my-page" component={UserPage} />
			</Switch>

			{/* Footer */}
			<Footer />
		</div>
	);
}

export default App;
