import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { retrieveFeaturedProducts } from './selector';

import { Box, Button, Container, Grid, Stack, Typography, Tooltip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReadMoreIcon from '@mui/icons-material/ReadMore';

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

					<Link to="/products?isFeatured=true" className="view-all-link">
						<Button endIcon={<ArrowForwardIcon />}>View All</Button>
					</Link>
				</Stack>

				<Grid container spacing={3} className="products-grid">
					{featuredProducts && featuredProducts.length > 0 ? (
						featuredProducts.map((product) => (
							<Grid size={{ xs: 12, sm: 6, md: 3 }} key={product._id}>
								<Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
									<Stack className="product-card">
										<Box className="product-image-wrapper">
											<img src={product.productImages[0]} alt={product.productName} className="product-image" />
											<Box component="span" className="product-category">
												{product.productCategory}
											</Box>
										</Box>

										<Stack direction="row" className="product-info" alignItems="center" justifyContent="space-between">
											<Box>
												<Typography variant="h6" className="product-name">
													{product.productName}
												</Typography>
											</Box>
											<Tooltip title="View Details" placement="top" arrow>
												<Button className="details-button" component={Link} to={`/products/${product._id}`}>
													<ReadMoreIcon />
												</Button>
											</Tooltip>
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
