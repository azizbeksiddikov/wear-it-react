import React from 'react';
import { Box, Button, Container, Grid, Stack, Typography, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import '../../../css/homePage/saleProducts.css';

const products = [
	{
		id: 100,
		name: 'Classic White T-shirt',
		image: 'img/t-shirt.jpg',
		category: 'Tops',
	},
	{
		id: 100,
		name: 'Classic White T-shirt',
		image: 'img/t-shirt.jpg',
		category: 'Tops',
	},
	{
		id: 100,
		name: 'Classic White T-shirt',
		image: 'img/t-shirt.jpg',
		category: 'Tops',
	},
	{
		id: 100,
		name: 'Classic White T-shirt',
		image: 'img/t-shirt.jpg',
		category: 'Tops',
	},
];

export default function SaleProducts() {
	return (
		<div className="sale-section">
			<Container>
				<Stack className="sale-header" direction="row" justifyContent="space-between" alignItems="flex-start">
					<Stack className="sale-title">
						<Typography variant="h2">Sale Products</Typography>
						<Typography variant="body1">Special offers with amazing discounts</Typography>
					</Stack>

					<Link to="/products" className="view-all-link">
						<Button endIcon={<ArrowForwardIcon />}>View All</Button>
					</Link>
				</Stack>

				<Grid container spacing={3} className="products-grid">
					{products.length > 0 ? (
						products.map((product) => (
							<Grid item xs={12} sm={6} md={3} key={product.id}>
								<Stack className="product-card">
									<Box className="product-image-wrapper">
										<img src={product.image} alt={product.name} className="product-image" />
										<Box component="span" className="product-category">
											{product.category}
										</Box>
									</Box>

									<Stack direction="row" className="product-info" alignItems="center" justifyContent="space-between">
										<Box>
											<Typography variant="h6" className="product-name">
												{product.name}
											</Typography>
										</Box>
										<Tooltip title="View Details" placement="top" arrow>
											<Button className="details-button" component={Link} to={`/products/${product.id}`}>
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
