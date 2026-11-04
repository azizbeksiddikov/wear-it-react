import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { retrieveFeaturedProducts } from './selector';

import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReadMoreIcon from '@mui/icons-material/ReadMore';

import { handleImageError, photoOf } from '../../../libs/image';
import '../../../css/homePage/featuredProducts.css';

const FeaturedProductsRetriever = createSelector(retrieveFeaturedProducts, (featuredProducts) => ({
	featuredProducts,
}));

export default function FeaturedProducts() {
	const { featuredProducts } = useSelector(FeaturedProductsRetriever);

	return (
		<div className="featured-section">
			<Container>
				<Stack className="featured-header" direction="row" justifyContent="space-between" alignItems="flex-start">
					<Stack className="featured-title">
						<Typography variant="h2">Featured Products</Typography>
						<Typography variant="body1">Handpicked selections just for you</Typography>
					</Stack>

					<Button
						component={Link}
						to="/products?isFeatured=true"
						className="view-all-link"
						endIcon={<ArrowForwardIcon />}
					>
						View All
					</Button>
				</Stack>

				<Grid container spacing={{ xs: 1.5, sm: 3 }} className="products-grid">
					{featuredProducts && featuredProducts.length > 0 ? (
						featuredProducts.map((product) => (
							<Grid size={{ xs: 6, sm: 6, md: 3 }} key={product._id}>
								<Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
									<Stack className="product-card">
										<Box className="product-image-wrapper">
											<img
												src={photoOf(product.productImages)}
												alt={product.productName}
												className="product-image"
												loading="lazy"
												onError={handleImageError}
											/>
											<Box component="span" className="product-category">
												{product.productCategory}
											</Box>
										</Box>

										<Stack direction="row" className="product-info" alignItems="center" justifyContent="space-between">
											<Box>
												<Typography variant="h6" className="product-name">
													{product.productName}
												</Typography>
												{product.cheapestProductVariant && (
													<Typography component="div" className="product-price-line">
														{product.cheapestProductVariant.salePrice ? (
															<>
																<span className="price-now">${product.cheapestProductVariant.salePrice}</span>
																<span className="price-was">${product.cheapestProductVariant.productPrice}</span>
															</>
														) : (
															<span className="price-now">${product.cheapestProductVariant.productPrice}</span>
														)}
													</Typography>
												)}
											</Box>
											{/* The whole card is the link; this icon is only a visual hint */}
											<span className="details-button" aria-hidden="true">
												<ReadMoreIcon />
											</span>
										</Stack>
									</Stack>
								</Link>
							</Grid>
						))
					) : (
						<Box className="empty-products">
							<Typography variant="body1">No products are available at the moment.</Typography>
						</Box>
					)}
				</Grid>
			</Container>
		</div>
	);
}
