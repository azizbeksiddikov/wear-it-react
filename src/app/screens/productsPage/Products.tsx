import React, { useState, useEffect, useMemo } from 'react';
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
	CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';

import ProductService from '../../services/ProductService';
import { ProductCategory, ProductGender } from '../../../libs/enums/product.enum';
import { ProductsInquiry, ProductsOutput } from '../../../libs/types/product';
import { Direction } from '../../../libs/enums/common.enum';
import { handleImageError, photoOf } from '../../../libs/image';
import { sweetErrorHandling } from '../../../libs/sweetAlert';
import { friendlyErrorMessage } from '../../../libs/errorMessages';

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
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [loadFailed, setLoadFailed] = useState(false);
	const [loadError, setLoadError] = useState('');
	const [reloadKey, setReloadKey] = useState(0);
	const activeFilterCount =
		(productSearch.productCategory ? 1 : 0) +
		(productSearch.productGender ? 1 : 0) +
		(productSearch.isFeatured ? 1 : 0) +
		(productSearch.onSale ? 1 : 0);

	const productService = useMemo(() => new ProductService(), []);

	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const updatedSearch: ProductsInquiry = {
			...productSearch,
			isFeatured: searchParams.get('isFeatured') === 'true',
			onSale: searchParams.get('onSale') === 'true',
			productCategory: searchParams.has('productCategory')
				? (searchParams.get('productCategory')?.toUpperCase() as ProductCategory | undefined)
				: undefined,
			productGender: searchParams.has('productGender')
				? (searchParams.get('productGender')?.toUpperCase() as ProductGender | undefined)
				: undefined,
			search: searchParams.get('search') || '',
			page: 1,
		};

		setSearchText(updatedSearch.search || '');
		setProductSearch(updatedSearch);
		window.scrollTo({
			top: 25,
			left: 0,
			behavior: 'smooth',
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.search]);

	useEffect(() => {
		setLoading(true);
		setLoadFailed(false);
		productService
			.getProducts(productSearch)
			.then((data) => {
				setProducts(data);

				setTotalPages(Math.ceil((data.count as any)[0]?.total / productSearch.limit) || 1);
			})
			.catch((err) => {
				console.log(err);
				setLoadFailed(true);
				setLoadError(friendlyErrorMessage(err));
				sweetErrorHandling(err).then();
			})
			.finally(() => setLoading(false));
		window.scrollTo({
			top: 25,
			left: 0,
			behavior: 'smooth',
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productSearch, reloadKey]);

	const searchTextHandler = (text: string) => {
		setSearchText(text);
	};

	// HANDLERS
	const PaginationHandler = (_e: React.ChangeEvent<unknown>, value: number) => {
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

	const clearAllFiltersHandler = () => {
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
								type="search"
								inputProps={{ 'aria-label': 'Search products', enterKeyHint: 'search' }}
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

						<Stack className="sort-row">
							<Button
								variant="outlined"
								className="filters-toggle"
								startIcon={<TuneIcon />}
								aria-expanded={filtersOpen}
								onClick={() => setFiltersOpen((o) => !o)}
							>
								Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
							</Button>
							<FormControl variant="outlined" size="small" className="sort-select">
								<InputLabel id="sort-select-label">Sort by</InputLabel>
								<Select
									labelId="sort-select-label"
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
				</Stack>

				{/* Main content with filters, products, pagination */}
				<Stack className="products-content">
					{/* Filters Sidebar */}
					<Grid size={{ xs: 12, md: 3 }} className={`filters-sidebar${filtersOpen ? ' open' : ''}`}>
						<Typography variant="h6" className="filter-heading">
							Filters
						</Typography>

						{/* Category Filters */}
						<Box className="filter-section">
							<Typography variant="subtitle1" className="filter-subheading" id="category-select-label">
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
							<Typography variant="subtitle1" className="filter-subheading" id="gender-select-label">
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
						<Button
							variant="outlined"
							onClick={clearAllFiltersHandler}
							className="clear-filters-btn"
							disabled={activeFilterCount === 0 && !productSearch.search}
						>
							Clear All Filters
						</Button>
					</Grid>

					{/* Products Grid with Pagination */}
					<Stack className="products-container" aria-busy={loading}>
						{loading && !products?.list.length ? (
							<Box className="no-products" role="status">
								<CircularProgress aria-label="Loading products" />
							</Box>
						) : loadFailed && !products?.list.length ? (
							<Box className="no-products" role="alert">
								<Typography variant="h6">We could not load the products.</Typography>
								<Typography variant="body2" className="no-products-hint">
									{loadError}
								</Typography>
								<Button variant="outlined" onClick={() => setReloadKey((k) => k + 1)} className="reset-button">
									Try again
								</Button>
							</Box>
						) : products && products.list.length > 0 ? (
							<>
								<Grid container spacing={{ xs: 1.5, sm: 3 }} className="products-grid">
									{products.list.map((product) => (
										<Grid size={{ xs: 6, sm: 6, lg: 4 }} key={product._id}>
											<Link to={`/products/${product._id}`} className="product-link">
												<Card className="product-card">
													{/* Product image with badges */}
													<Box className="product-image-container">
														<CardMedia
															component="img"
															image={photoOf(product.productImages)}
															alt={product.productName}
															className="product-image"
															loading="lazy"
															onError={handleImageError}
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
								<Typography variant="body2" className="no-products-hint">
									Try different words, or clear the filters.
								</Typography>
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
