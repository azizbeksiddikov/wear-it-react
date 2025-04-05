import React, { useEffect } from 'react';
import { useQueries } from '@tanstack/react-query';
import { Dispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { setFeaturedProducts, setSaleProducts } from './slice';

import Advertisement from './Advertisement';
import FeaturedProducts from './FeaturedProducts';
import Introduction from './Introduction';
import SaleProducts from './SaleProducts';

import ProductService from '../../services/ProductServices';
import { Direction } from '../../../libs/enums/common.enum';
import { Product } from '../../../libs/types/product';

import '../../../css/homePage/home.css';

const actionDispatch = (dispatch: Dispatch) => ({
	setFeaturedProducts: (data: Product[]) => dispatch(setFeaturedProducts(data)),
	setSaleProducts: (data: Product[]) => dispatch(setSaleProducts(data)),
});

export default function HomePage() {
	const { setFeaturedProducts, setSaleProducts } = actionDispatch(useDispatch());
	const productService = new ProductService();

	const queries = [
		{
			queryKey: ['featured-products'],
			queryFn: () =>
				productService.getProducts({
					page: 1,
					limit: 4,
					direction: Direction.DESC,
					isFeatured: true,
				}),
		},
		{
			queryKey: ['sale-products'],
			queryFn: () =>
				productService.getProducts({
					page: 1,
					limit: 4,
					direction: Direction.DESC,
					onSale: true,
				}),
		},
	];

	const results = useQueries({ queries });

	useEffect(() => {
		const [featuredResult, saleResult] = results;

		if (featuredResult.isSuccess && featuredResult.data) {
			setFeaturedProducts(featuredResult.data.list);
		} else if (featuredResult.isError) {
			console.error('Error fetching featured products:', featuredResult.error);
		}

		if (saleResult.isSuccess && saleResult.data) {
			setSaleProducts(saleResult.data.list);
		} else if (saleResult.isError) {
			console.error('Error fetching sale products:', saleResult.error);
		}
	}, [results]);

	return (
		<div className={'homepage'}>
			<Introduction />
			<FeaturedProducts />
			<SaleProducts />
			<Advertisement />
		</div>
	);
}
