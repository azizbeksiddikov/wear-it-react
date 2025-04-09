import React from 'react';
import { useQueries } from '@tanstack/react-query';
import { Dispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { setFeaturedProducts, setSaleProducts } from './slice';

import Advertisement from './Advertisement';
import FeaturedProducts from './FeaturedProducts';
import Introduction from './Introduction';
import SaleProducts from './SaleProducts';

import ProductService from '../../services/ProductService';
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

	useQueries({
		queries: [
			{
				queryKey: ['featured-products'],
				queryFn: async () => {
					const result = await productService.getProducts({
						page: 1,
						limit: 4,
						direction: Direction.DESC,
						isFeatured: true,
					});
					if (result.list.length === 0) {
						return [];
					}
					setFeaturedProducts(result.list);
					return result.list;
				},
				staleTime: 5 * 60 * 1000, // 5 minutes
			},
			{
				queryKey: ['sale-products'],
				queryFn: async () => {
					const result = await productService.getProducts({
						page: 1,
						limit: 4,
						direction: Direction.DESC,
						onSale: true,
					});
					if (result.list.length === 0) {
						return [];
					}

					setSaleProducts(result.list);
					return result.list;
				},
				staleTime: 5 * 60 * 1000, // 5 minutes
			},
		],
	});

	return (
		<div className={'homepage'}>
			<Introduction />
			<FeaturedProducts />
			<SaleProducts />
			<Advertisement />
		</div>
	);
}
