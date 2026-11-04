import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { retrieveFeaturedProducts, retrieveSaleProducts } from './selector';

import { Button, Typography } from '@mui/material';

import { handleImageError } from '../../../libs/image';
import '../../../css/homePage/introduction.css';

const heroRetriever = createSelector(retrieveFeaturedProducts, retrieveSaleProducts, (featured, sale) => {
	const seen = new Set<string>();
	return [...(featured ?? []), ...(sale ?? [])]
		.filter((p) => p.productImages?.[0] && !seen.has(p._id) && seen.add(p._id))
		.slice(0, 8);
});

export default function Introduction() {
	const heroProducts = useSelector(heroRetriever);

	return (
		<div className="introduction-frame">
			<div className="introduction-frame-content">
				<Typography variant="h1" className="introduction-title">
					Discover Your <span className="text-primary">Style</span>
				</Typography>
				<Typography className="intro-text">Find inspiration and shop the latest trends curated just for you</Typography>
				<Button component={Link} to="/products" variant="contained" className="shop-button">
					Shop Now
				</Button>
			</div>

			{heroProducts.length > 0 && (
				<div className="hero-strip" aria-label="Featured picks">
					{heroProducts.map((product) => {
						const v = product.cheapestProductVariant;
						return (
							<Link to={`/products/${product._id}`} className="hero-strip-card" key={product._id}>
								<img
									src={product.productImages[0]}
									alt={product.productName}
									loading="lazy"
									onError={handleImageError}
								/>
								<span className="hero-strip-name">{product.productName}</span>
								{v && <span className="hero-strip-price">${v.salePrice || v.productPrice}</span>}
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
