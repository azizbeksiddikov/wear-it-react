import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { setProducts } from './slice';
import { retrieveProducts } from './selector';

import {
	Box,
	Button,
	Container,
	Grid,
	Typography,
	TextField,
	InputAdornment,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Card,
	CardMedia,
	CardContent,
	Chip,
	Pagination,
	Stack,
	Divider,
	FormGroup,
	FormControlLabel,
	Checkbox,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import ProductService from '../../services/ProductService';
import { ProductCategory, ProductGender } from '../../../libs/enums/product.enum';
import { ProductsInquiry, ProductsOutput } from '../../../libs/types/product';
import { Direction } from '../../../libs/enums/common.enum';

import '../../../css/productsPage/products.css';

const actionDispatch = (dispatch: Dispatch) => ({
	setProducts: (data: ProductsOutput) => dispatch(setProducts(data)),
});
const productsRetriever = createSelector(retrieveProducts, (products) => ({
	products,
}));

const categoriesOptions = ['All Categories', ...Object.values(ProductCategory)];
const gendersOptions = ['All Genders', ...Object.values(ProductGender)];

export default function Products() {
	const { setProducts } = actionDispatch(useDispatch());
	const { products } = useSelector(productsRetriever);
	const location = useLocation();

	const [productSearch, setProductSearch] = useState<ProductsInquiry>({
		page: 1,
		limit: 6,
		direction: Direction.DESC,
		isFeatured: false,
		productCategory: undefined,
		productGender: undefined,
		onSale: false,
		search: '',
	});
	const [searchText, setSearchText] = useState('');
	const [totalPages, setTotalPages] = useState(1);

	const productService = new ProductService();

	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);

		productSearch.isFeatured = searchParams.get('isFeatured') === 'true';
		productSearch.onSale = searchParams.get('onSale') === 'true';

		if (searchParams.has('productCategory')) {
			productSearch.productCategory = searchParams.get('productCategory')?.toUpperCase() as ProductCategory | undefined;
		} else {
			productSearch.productCategory = undefined;
		}

		if (searchParams.has('productGender')) {
			productSearch.productGender = searchParams.get('productGender')?.toUpperCase() as ProductGender | undefined;
		} else {
			productSearch.productGender = undefined;
		}

		if (searchParams.has('search')) {
			productSearch.search = searchParams.get('search') || '';
			setSearchText(productSearch.search);
		} else {
			productSearch.search = '';
			setSearchText('');
		}

		setProductSearch({ ...productSearch, page: 1 });
		window.scrollTo({
			top: 25,
			left: 0,
			behavior: 'smooth',
		});
	}, [location.search]);

	useEffect(() => {
		productService
			.getProducts(productSearch)
			.then((data) => {
				setProducts(data);

				setTotalPages(Math.ceil(data.count[0]?.total / productSearch.limit) || 1);
			})
			.catch((err) => console.log(err));
		window.scrollTo({
			top: 25,
			left: 0,
			behavior: 'smooth',
		});
	}, [productSearch]);

	const searchTextHandler = (text: string) => {
		setSearchText(text);
	};

	// HANDLERS
	const PaginationHandler = (e: ChangeEvent, value: number) => {
		// pageHandler
		setProductSearch({ ...productSearch, page: value });
	};

	const directionHandler = (value: string) => {
		if (value === 'new') productSearch.direction = Direction.DESC;
		else if (value === 'old') productSearch.direction = Direction.ASC;

		setProductSearch({ ...productSearch, page: 1 });
	};

	const categoryHandler = (value: string) => {
		if (value === 'All Categories') productSearch.productCategory = undefined;
		else productSearch.productCategory = value as ProductCategory;

		setProductSearch({ ...productSearch, page: 1 });
	};

	const searchProductHandler = () => {
		productSearch.search = searchText;
		setProductSearch({ ...productSearch, page: 1 });
	};

	const genderProductHandler = (value: string) => {
		if (value === 'All Genders') productSearch.productGender = undefined;
		else productSearch.productGender = value as ProductGender;

		setProductSearch({ ...productSearch, page: 1 });
	};

	const onFeatureHandler = (value: boolean) => {
		productSearch.isFeatured = value;
		setProductSearch({ ...productSearch, page: 1 });
	};

	const onSaleHandler = (value: boolean) => {
		productSearch.onSale = value;
		setProductSearch({ ...productSearch, page: 1 });
	};

	const clearAllFiltersHandler = (e: ChangeEvent) => {
		productSearch.page = 1;
		productSearch.limit = 6;
		productSearch.direction = Direction.DESC;
		productSearch.productCategory = undefined;
		productSearch.productGender = undefined;
		productSearch.isFeatured = false;
		productSearch.onSale = false;
		productSearch.search = '';
		setSearchText(''); // Clear search text input
		setProductSearch({ ...productSearch });
	};

	return (
		<div className="products-page">
			<Container>
				{/* Header */}
				<Stack className="products-header">
					<Stack className="page-title-container">
						<Typography variant="h4" component="h1" className="page-title">
							Products
						</Typography>
						<Typography variant="body1" className="page-subtitle">
							Discover our curated collection
						</Typography>
					</Stack>

					<Stack className="search-and-sort">
						<Stack className="search-container">
							<TextField
								placeholder="Search products..."
								value={searchText}
								onChange={(e) => searchTextHandler(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') searchProductHandler();
								}}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon />
										</InputAdornment>
									),
								}}
								variant="outlined"
								size="small"
								className="search-input"
							/>
							<Button variant="contained" className="search-button" onClick={searchProductHandler}>
								Search
							</Button>
						</Stack>

						<FormControl variant="outlined" size="small" className="sort-select">
							<InputLabel>Sort by</InputLabel>
							<Select
								value={productSearch.direction === Direction.DESC ? 'new' : 'old'}
								onChange={(e) => directionHandler(e.target.value)}
								label="Sort by"
							>
								<MenuItem value="new">Newest</MenuItem>
								<MenuItem value="old">Oldest</MenuItem>
							</Select>
						</FormControl>
					</Stack>
				</Stack>

				{/* Main content with filters, products, pagination */}
				<Stack className="products-content">
					{/* Filters Sidebar */}
					<Grid item xs={12} md={3} className="filters-sidebar">
						<Typography variant="h6" className="filter-heading">
							Filters
						</Typography>

						{/* Category Filters */}
						<Box className="filter-section">
							<Typography variant="subtitle1" className="filter-subheading">
								Categories
							</Typography>
							<FormControl fullWidth variant="outlined" size="small">
								<Select
									labelId="category-select-label"
									id="category-select"
									value={productSearch.productCategory ?? 'All Categories'}
									onChange={(e) => {
										categoryHandler(e.target.value);
									}}
									displayEmpty
								>
									{categoriesOptions.map((category) => (
										<MenuItem key={category} value={category}>
											{category}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>

						<Divider className="filter-divider" />

						{/* Gender Filters */}
						<Box className="filter-section">
							<Typography variant="subtitle1" className="filter-subheading">
								Gender
							</Typography>
							<FormControl fullWidth variant="outlined" size="small">
								<Select
									labelId="gender-select-label"
									id="gender-select"
									value={productSearch.productGender ?? 'All Genders'}
									onChange={(e) => {
										genderProductHandler(e.target.value);
									}}
									displayEmpty
								>
									{gendersOptions.map((gender) => (
										<MenuItem key={gender} value={gender}>
											{gender}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>

						<Divider className="filter-divider" />

						{/* Product Status Filters */}
						<Box className="filter-section">
							<Typography variant="subtitle1" className="filter-subheading">
								Product Status
							</Typography>
							<FormGroup>
								<FormControlLabel
									control={
										<Checkbox
											checked={!!productSearch.isFeatured}
											onChange={(e) => onFeatureHandler(e.target.checked)}
											name="isFeatured"
										/>
									}
									label="Featured Products"
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={!!productSearch.onSale}
											onChange={(e) => onSaleHandler(e.target.checked)}
											name="isSale"
										/>
									}
									label="Sale Products"
								/>
							</FormGroup>
						</Box>

						{/* Clear All Filters Button */}
						<Button variant="outlined" onClick={clearAllFiltersHandler} className="clear-filters-btn">
							Clear All Filters
						</Button>
					</Grid>

					{/* Products Grid with Pagination */}
					<Stack className="products-container">
						{products && products.list.length > 0 ? (
							<>
								<Grid container spacing={3} className="products-grid">
									{products.list.map((product) => (
										<Grid item xs={12} sm={6} lg={4} key={product._id}>
											<Link to={`/products/${product._id}`} className="product-link">
												<Card className="product-card">
													{/* Product image with badges */}
													<Box className="product-image-container">
														<CardMedia
															component="img"
															image={product.productImages[0]}
															alt={product.productName}
															className="product-image"
														/>
														{product.isFeatured && <Chip label="Featured" className="featured-badge" />}
														{product.onSale && <Chip label="Sale" className="sale-badge" />}
													</Box>

													{/* Product details */}
													<CardContent className="product-card-content">
														<Typography variant="body1" className="product-name">
															{product.productName}
														</Typography>
														<Typography variant="body2" className="product-category">
															{product.productCategory}
														</Typography>

														<Typography variant="body2" className="product-price">
															{product.cheapestProductVariant?.salePrice ? (
																<>
																	<span className="original-price">${product.cheapestProductVariant.productPrice}</span>
																	<span className="sale-price">${product.cheapestProductVariant.salePrice}</span>
																</>
															) : (
																<span>
																	${product.cheapestProductVariant ? product.cheapestProductVariant.productPrice : 0}
																</span>
															)}
														</Typography>
													</CardContent>
												</Card>
											</Link>
										</Grid>
									))}
								</Grid>

								{/* Pagination - Always shown regardless of page count */}
								<Box className="pagination-container">
									<Pagination
										count={Math.max(totalPages, 1)}
										page={productSearch.page}
										onChange={PaginationHandler}
										color="primary"
										size="large"
										className="pagination"
									/>
								</Box>
							</>
						) : (
							<Box className="no-products">
								<Typography variant="h6">No products found matching your criteria.</Typography>
								<Button variant="outlined" onClick={clearAllFiltersHandler} className="reset-button">
									Reset Filters
								</Button>
							</Box>
						)}
					</Stack>
				</Stack>
			</Container>
		</div>
	);
}
