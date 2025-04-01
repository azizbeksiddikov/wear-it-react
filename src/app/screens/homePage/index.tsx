import React from 'react';
import Statistics from './Statistics';
import FeaturedClothes from './FeaturedClothes';
import SaleClothes from './SaleClothes';
import Advertisement from './Advertisement';
import Events from './Events';

export default function HomePage() {
	return (
		<div className={'homepage'}>
			<Statistics />
			<FeaturedClothes />
			<SaleClothes />
			<Advertisement />
			<Events />
		</div>
	);
}
