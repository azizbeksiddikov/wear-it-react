import React, { useState, useEffect, ChangeEvent } from 'react';
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
import { ProductCategory, ProductGender } from '../../../libs/enums/product.enum';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { setProducts } from './slice';
import { createSelector } from 'reselect';
import { retrieveProducts } from './selector';
import ProductService from '../../services/ProductServices';
import { ProductInquiry, ProductsOutput } from '../../../libs/types/product';
import { Direction } from '../../../libs/enums/common.enum';
import '../../../css/productsPage/products.css';
import { Link, useLocation } from 'react-router-dom';

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
	const [isInitialized, setIsInitialized] = useState(false);

	const [productSearch, setProductSearch] = useState<ProductInquiry>({
		page: 1,
		limit: 6,
		direction: Direction.DESC,
		search: '',
		isFeatured: false,
		onSale: false,
	});
	const [searchText, setSearchText] = useState('');
	const [totalPages, setTotalPages] = useState(1);
	const [sortValue, setSortValue] = useState('new');
	const location = useLocation();
	const getQueryParams = () => {
		const searchParams = new URLSearchParams(location.search);
		const params: Record<string, string> = {};

		searchParams.forEach((value, key) => {
			params[key] = value;
		});

		return params;
	};
	const productService = new ProductService();

	useEffect(() => {
		if (!isInitialized) return;

		productService
			.getProducts(productSearch)
			.then((data) => {
				setProducts(data);
				const total = data.count[0]?.total ?? 0;
				setTotalPages(Math.ceil(total / 8) || 1);
			})
			.catch((err) => console.log(err));
	}, [productSearch]);

	useEffect(() => {
		if (!isInitialized) return;

		if (searchText === '') {
			productSearch.search = '';
			setProductSearch({ ...productSearch });
		}
	}, [searchText]);

	useEffect(() => {
		const params = getQueryParams();

		productSearch.page = 1;
		productSearch.direction = Direction.DESC;
		setSortValue('new');
		productSearch.productCategory = undefined;
		productSearch.productGender = undefined;
		productSearch.isFeatured = false;
		productSearch.onSale = false;
		productSearch.search = '';

		// Check for filters in the URL
		if (params.isFeatured) {
			productSearch.isFeatured = params.isFeatured === 'true';
		}

		if (params.onSale) {
			productSearch.onSale = params.onSale === 'true';
		}

		if (params.category) {
			productSearch.productCategory = params.category.toUpperCase() as ProductCategory;
		}

		if (params.gender) {
			productSearch.productGender = params.gender.toUpperCase() as ProductGender;
		}

		if (params.search) {
			const search = params.search || '';
			productSearch.search = search;
			setSearchText(search);
		}

		if (Object.keys(params).length > 0) {
			const cleanUrl = window.location.pathname;
			window.history.replaceState({}, document.title, cleanUrl);
		}

		setIsInitialized(true);
		setProductSearch({ ...productSearch });
	}, [location.search]);

	// HANDLERS
	const PaginationHandler = (e: ChangeEvent, value: number) => {
		productSearch.page = value;
		setProductSearch({ ...productSearch });
	};

	const directionHandler = (value: string) => {
		setSortValue(value);
		if (value === 'new') {
			productSearch.direction = Direction.DESC;
		} else if (value === 'old') {
			productSearch.direction = Direction.ASC;
		}
		productSearch.page = 1;
		setProductSearch({ ...productSearch });
	};

	const categoryHandler = (value: string) => {
		if (value === 'All Categories') {
			productSearch.productCategory = undefined;
		} else {
			productSearch.productCategory = value as ProductCategory;
		}
		productSearch.page = 1;

		setProductSearch({ ...productSearch });
	};

	const searchProductHandler = () => {
		productSearch.page = 1;
		productSearch.search = searchText;
		productSearch.page = 1;

		setProductSearch({ ...productSearch });
	};

	const genderProductHandler = (value: string) => {
		if (value === 'All Genders') {
			productSearch.productGender = undefined;
		} else {
			productSearch.productGender = value as ProductGender;
		}
		productSearch.page = 1;

		setProductSearch({ ...productSearch });
	};

	const isFeaturedHandler = (value: boolean) => {
		productSearch.isFeatured = value;
		productSearch.page = 1;

		setProductSearch({ ...productSearch });
	};

	const onSaledHandler = (value: boolean) => {
		productSearch.onSale = value;
		productSearch.page = 1;

		setProductSearch({ ...productSearch });
	};

	const clearAllFiltersHandler = (e: ChangeEvent) => {
		productSearch.page = 1;
		productSearch.direction = Direction.DESC;
		setSortValue('new');
		productSearch.productCategory = undefined;
		productSearch.productGender = undefined;
		productSearch.isFeatured = false;
		productSearch.onSale = false;
		productSearch.search = '';
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
								onChange={(e) => setSearchText(e.target.value)}
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
							<Select value={sortValue} onChange={(e) => directionHandler(e.target.value)} label="Sort by">
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
											onChange={(e) => isFeaturedHandler(e.target.checked)}
											name="isFeatured"
										/>
									}
									label="Featured Products"
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={!!productSearch.onSale}
											onChange={(e) => onSaledHandler(e.target.checked)}
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
