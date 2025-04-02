import React, { useEffect } from 'react';
import Introduction from './Introduction';
import FeaturedProducts from './FeaturedProducts';
import SaleProducts from './SaleProducts';
import Advertisement from './Advertisement';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { setFeaturedProducts, setSaleProducts } from './slice';
import { retrieveFeaturedProducts, retrieveSaleProducts } from './selector';
import { Product } from '../../../libs/types/product';
import '../../../css/homePage/home.css';

/** Redux slice & selector */
const actionDispatch = (dispatch: Dispatch) => ({
	setFeaturedProducts: (data: Product[]) => dispatch(setFeaturedProducts(data)),
});
const popularDishesRetriever = createSelector(retrieveFeaturedProducts, (featuredProducts) => ({ featuredProducts }));

export default function HomePage() {
	const { setFeaturedProducts } = actionDispatch(useDispatch());
	const { featuredProducts } = useSelector(popularDishesRetriever);

	useEffect(() => {}, []);

	return (
		<div className={'homepage'}>
			<Introduction />
			<FeaturedProducts />
			<SaleProducts />
			<Advertisement />
		</div>
	);
}
