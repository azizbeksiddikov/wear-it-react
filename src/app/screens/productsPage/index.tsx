import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import ChosenProduct from './ChosenProduct';
import Products from './Products';
import { CartItem } from '../../../libs/types/search';

interface ProductsPageProps {
	cartItems: CartItem[];
	onAdd: (item: CartItem) => void;
	onRemove: (item: CartItem) => void;
	onDelete: (item: CartItem) => void;
	onDeleteAll: () => void;
}

export default function ProductsPage(props: ProductsPageProps) {
	const products = useRouteMatch();
	const { onAdd } = props;

	return (
		<div className="products-page">
			<Switch>
				<Route path={`${products.path}/:productId`}>
					<ChosenProduct onAdd={onAdd} />
				</Route>
				<Route path={`${products.path}/`}>
					<Products />
				</Route>
			</Switch>
		</div>
	);
}
