import React from 'react';
import Statistics from './Statistics';
import FeaturedProducts from './FeaturedProducts';
import SaleClothes from './SaleProducts';
import Advertisement from './Advertisement';
import Events from './Events';
import '../../../css/home.css';

export default function HomePage() {
	return (
		<div className={'homepage'}>
			<Statistics />
			<FeaturedProducts />
			<SaleClothes />
			<Advertisement />
			<Events />
		</div>
	);
}
