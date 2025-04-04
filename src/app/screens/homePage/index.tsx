import React, { useEffect } from 'react';
import Introduction from './Introduction';
import FeaturedProducts from './FeaturedProducts';
import SaleProducts from './SaleProducts';
import Advertisement from './Advertisement';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { setFeaturedProducts, setSaleProducts } from './slice';
import { Product, ProductsOutput } from '../../../libs/types/product';
import ProductService from '../../services/ProductServices';
import { Direction } from '../../../libs/enums/common.enum';
import '../../../css/homePage/home.css';

const actionDispatch = (dispatch: Dispatch) => ({
	setFeaturedProducts: (data: Product[]) => dispatch(setFeaturedProducts(data)),
	setSaleProducts: (data: Product[]) => dispatch(setSaleProducts(data)),
});

export default function HomePage() {
	const { setFeaturedProducts, setSaleProducts } = actionDispatch(useDispatch());

	useEffect(() => {
		const product = new ProductService();

		Promise.all([
			product.getProducts({
				page: 1,
				limit: 4,
				direction: Direction.DESC,
				isFeatured: true,
			}),
			product.getProducts({
				page: 1,
				limit: 4,
				direction: Direction.DESC,
				onSale: true,
			}),
		])
			.then(([featuredData, saleData]: [Products, Products]) => {
				setFeaturedProducts(featuredData.list);
				setSaleProducts(saleData.list);
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
