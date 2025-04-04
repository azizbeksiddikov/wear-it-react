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
import { Product, Products } from '../../../libs/types/product';
import ProductService from '../../services/ProductServices';
import '../../../css/homePage/home.css';
import { Direction } from '../../../libs/enums/common.enum';

/** Redux slice & selector */
const actionDispatch = (dispatch: Dispatch) => ({
	setFeaturedProducts: (data: Product[]) => dispatch(setFeaturedProducts(data)),
});
const popularDishesRetriever = createSelector(retrieveFeaturedProducts, (featuredProducts) => ({ featuredProducts }));

export default function HomePage() {
	const { setFeaturedProducts } = actionDispatch(useDispatch());
	const { featuredProducts } = useSelector(popularDishesRetriever);

	useEffect(() => {
		const product = new ProductService();
		product
			.getProducts({
				page: 1,
				limit: 4,
				direction: Direction.DESC,
				isFeatured: true,
			})
			.then((data: Products) => {
				const featuredProductsList = data.list;
				setFeaturedProducts(featuredProductsList);
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<div className={'homepage'}>
			<Introduction />
			<FeaturedProducts />
			<SaleProducts />
			<Advertisement />
		</div>
	);
}
