import React from 'react';
import { Box, Button, Container, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Badge from '@mui/material/Badge';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TextField from '@mui/material/TextField';

const products = [
	{ producName: 't-shirt', productImages: ['img/t-shirt.jpg'] },
	{ producName: 't-shirt', productImages: ['img/t-shirt.jpg'] },
	{ producName: 't-shirt', productImages: ['img/t-shirt.jpg'] },
	{ producName: 't-shirt', productImages: ['img/t-shirt.jpg'] },
	{ producName: 't-shirt', productImages: ['img/t-shirt.jpg'] },
	{ producName: 't-shirt', productImages: ['img/t-shirt.jpg'] },
	{ producName: 't-shirt', productImages: ['img/t-shirt.jpg'] },
	{ producName: 't-shirt', productImages: ['img/t-shirt.jpg'] },
];

export default function Products() {
	return (
		<div className="products">
			<Container>
				<Stack flexDirection={'column'} alignItems="center">
					<Stack className="avatar-big-box">
						<Box className="title">Burak Restaurant</Box>
						<Stack className="searchForm">
							<TextField id="outlined-basic" label="Type here" variant="outlined" />

							<Button variant="contained" className="searchButton" type="submit" endIcon={<SearchIcon />}>
								SEARCH
							</Button>
						</Stack>
					</Stack>

					<Stack className="dishes-filter-section">
						<Stack className="dishes-filter-box">
							<Button variant="contained" color="primary" className="order">
								New
							</Button>
							<Button variant="contained" color="secondary" className="order">
								Price
							</Button>
							<Button variant="contained" color="secondary" className="order">
								Views
							</Button>
						</Stack>
					</Stack>

					<Stack className="list-category-section">
						<Stack className="product-category ">
							<Button variant="contained" color="primary" className="type">
								Dish
							</Button>
							<Button variant="contained" color="secondary" className="type">
								Salad
							</Button>
							<Button variant="contained" color="secondary" className="type">
								Drink
							</Button>
							<Button variant="contained" color="secondary" className="type">
								Dessert
							</Button>
							<Button variant="contained" color="secondary" className="type">
								Other
							</Button>
						</Stack>

						<Stack className="product-wrapper">
							{products.length !== 0 ? (
								products.map((product, index) => {
									return (
										<Stack key={index} className="product-card">
											<Stack className="product-img" sx={{ backgroundImage: `url(${product.productImages[0]})` }}>
												<div className="products-sale">Normal size</div>
												<Button className="shop-btn">
													<img src="/icons/shopping-cart.svg" style={{ display: 'flex' }} alt="shopping-cart" />
												</Button>
												<Button className="view-btn" sx={{ right: '36px' }}>
													<Badge badgeContent={20} color="secondary">
														<RemoveRedEyeIcon sx={{ color: 20 ? 'gray' : 'white' }} />
													</Badge>
												</Button>
											</Stack>
											<Box className="product-desc">
												<span className="product-title">{product.productImages[0]}</span>
												<div className="product-desc">
													<MonetizationOnIcon /> {12}
												</div>
											</Box>
										</Stack>
									);
								})
							) : (
								<Box className="no-data">Products are not available</Box>
							)}
						</Stack>
					</Stack>

					<Stack className="pagination-section">
						<Pagination
							count={3}
							page={1}
							renderItem={(item) => (
								<PaginationItem
									components={{
										previous: ArrowBackIcon,
										next: ArrowForwardIcon,
									}}
									{...item}
									color={'secondary'}
								/>
							)}
						/>
					</Stack>
				</Stack>
			</Container>

			<div className="brands-logo">
				<Container className="brands-container">
					<Box className="family-title">Our Family Brands</Box>
					<Stack className="brand-wrapper">
						<Stack className="brand-card">
							<img src="img/doner.webp" className="brand-img" alt="" />
						</Stack>
						<Stack className="brand-card">
							<img src="img/seafood.webp" className="brand-img" alt="" />
						</Stack>
						<Stack className="brand-card">
							<img src="img/sweets.webp" className="brand-img" alt="" />
						</Stack>
						<Stack className="brand-card">
							<img src="img/gurme.webp" className="brand-img" alt="" />
						</Stack>
					</Stack>
				</Container>
			</div>

			<div className="address">
				<Container>
					<Stack className="address-area">
						<Box className="title">Our Address</Box>
						<iframe
							title="iframe"
							style={{ marginTop: '60px' }}
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.467927012871!2d-122.0841436846819!3d37.42199977982518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f7e3c3e4e3c6d%3A0x4b6b6b1d3e3c0b2e!2sGoogleplex!5e0!3m2!1sen!2str!4v1634742459931!5m2!1sen!2str"
							width="1320"
							height="500"
							referrerPolicy="no-referrer-when-downgrade"
						></iframe>
					</Stack>
				</Container>
			</div>
		</div>
	);
}
