import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ChosenProduct from './ChosenProduct';
import Products from './Products';
import { CartItem } from '../../../libs/types/search';

interface ProductsPageProps {
	cartItems: CartItem[];
	onAdd: (item: CartItem) => void;
}

export default function ProductsPage(props: ProductsPageProps) {
	const { onAdd } = props;

	return (
		<div className="products-page">
			<Routes>
				<Route path=":productId" element={<ChosenProduct onAdd={onAdd} />} />
				<Route path="" element={<Products />} />
			</Routes>
		</div>
	);
}
