import React from 'react';
import Statistics from './Statistics';
import FeatuedClothes from './FeatuedClothes';
import SaleClothes from './SaleClothes';
import Advertisement from './Advertisement';
import Events from './Events';

export default function HomePage() {
	return (
		<div className={'homepage'}>
			<Statistics />
			<FeatuedClothes />
			<SaleClothes />
			<Advertisement />
			<Events />
		</div>
	);
}
