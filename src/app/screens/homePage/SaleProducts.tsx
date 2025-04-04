import React from 'react';
import { Box, Button, Container, Grid, Stack, Typography, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { retrieveSaleProducts } from './selector';
import '../../../css/homePage/saleProducts.css';

const SaleProductsRetriever = createSelector(retrieveSaleProducts, (saleProducts) => ({
	saleProducts,
}));

export default function SaleProducts() {
	const { saleProducts } = useSelector(SaleProductsRetriever);

	return (
		<div className="sale-section">
			<Container>
				<Stack className="sale-header" direction="row" justifyContent="space-between" alignItems="flex-start">
					<Stack className="sale-title">
						<Typography variant="h2">Sale Products</Typography>
						<Typography variant="body1">Special offers with amazing discounts</Typography>
					</Stack>

					<Link to="/products?onSale=true" className="view-all-link">
						<Button endIcon={<ArrowForwardIcon />}>View All</Button>
					</Link>
				</Stack>

				<Grid container spacing={3} className="products-grid">
					{saleProducts.length > 0 ? (
						saleProducts.map((product) => (
							<Grid item xs={12} sm={6} md={3} key={product._id}>
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
							</Grid>
						))
					) : (
						<Box className="empty-products">
							<Typography variant="body1">No sale products are available at the moment.</Typography>
						</Box>
					)}
				</Grid>
			</Container>
		</div>
	);
}
