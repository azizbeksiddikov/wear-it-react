import React, { useState, useCallback, useEffect } from 'react';
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
} from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { ProductCategory, ProductGender } from '../../../libs/enums/product.enum';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { setProducts } from './slice';
import { createSelector } from 'reselect';
import { retrieveProducts } from './selector';
import ProductService from '../../services/ProductServices';
import { ProductsOutput } from '../../../libs/types/product';
import { Direction } from '../../../libs/enums/common.enum';
import '../../../css/productsPage/products.css';

const actionDispatch = (dispatch: Dispatch) => ({
	setProducts: (data: ProductsOutput) => dispatch(setProducts(data)),
});
const productsRetriever = createSelector(retrieveProducts, (products) => ({
	products,
}));

// Categories and genders for filters
const categories = Object.values(ProductCategory);
const genders = Object.values(ProductGender);

export default function Products() {
	const { setProducts } = actionDispatch(useDispatch());

	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState('new');
	const [page, setPage] = useState(1);
	const [selectedCategory, setSelectedCategory] = useState<string>('');
	const [selectedGender, setSelectedGender] = useState<string>('');
	const [productStatus, setProductStatus] = useState<string>('');
	const [totalPages, setTotalPages] = useState(0);

	const { products } = useSelector(productsRetriever);

	useEffect(() => {
		const productService = new ProductService();
		productService
			.getProducts({
				page: 1,
				limit: 8,
				direction: Direction.DESC,
			})
			.then((data) => {
				setProducts(data);
				const total = data.count[0]?.total ?? 0;
				setTotalPages(Math.ceil(total / 8) || 1);
			})
			.catch((err) => console.log(err));
	}, []);

	// HANDLERS
	const handleFilterChange = useCallback(
		(filterSetter: React.Dispatch<React.SetStateAction<string>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = event.target.value;
			filterSetter(newValue);
			setPage(1);
		},
		[setPage],
	);
	const handleCategoryChange = useCallback(handleFilterChange(setSelectedCategory), [handleFilterChange]);
	const handleGenderChange = useCallback(handleFilterChange(setSelectedGender), [handleFilterChange]);
	const handleProductStatusChange = useCallback(handleFilterChange(setProductStatus), [handleFilterChange]);

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
		window.scrollTo({
			top: (document.querySelector('.products-grid-container')?.offsetTop as number) - 120,
			behavior: 'smooth',
		});
	};

	const handleSearch = () => {
		setPage(1);
	};

	const clearAllFilters = () => {
		setSelectedCategory('');
		setSelectedGender('');
		setProductStatus('');
		setSearchQuery('');
		setPage(1);
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
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onKeyPress={(event) => {
									if (event.key === 'Enter') {
										handleSearch();
									}
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
							<Button variant="contained" className="search-button" onClick={handleSearch}>
								Search
							</Button>
						</Stack>

						<FormControl variant="outlined" size="small" className="sort-select">
							<InputLabel>Sort by</InputLabel>
							<Select value={sortBy} onChange={(e) => setSortBy(e.target.value as string)} label="Sort by">
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
									value={selectedCategory}
									onChange={handleCategoryChange}
									displayEmpty
									renderValue={(selected) => (selected ? selected : 'All Categories')}
								>
									<MenuItem value="">All Categories</MenuItem>
									{categories.map((category) => (
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
									value={selectedGender}
									onChange={handleGenderChange}
									displayEmpty
									renderValue={(selected) => (selected ? selected : 'All Genders')}
								>
									<MenuItem value="">All Genders</MenuItem>
									{genders.map((gender) => (
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
							<FormControl fullWidth variant="outlined" size="small">
								<Select
									labelId="status-select-label"
									id="status-select"
									value={productStatus}
									onChange={handleProductStatusChange}
									displayEmpty
									renderValue={(selected) => (selected ? selected : 'All Products')}
								>
									<MenuItem value="">All Products</MenuItem>
									<MenuItem value="featured">Featured</MenuItem>
									<MenuItem value="sale">Sale</MenuItem>
								</Select>
							</FormControl>
						</Box>

						{/* Clear All Filters Button */}
						{(selectedCategory !== '' || selectedGender !== '' || productStatus !== '') && (
							<Button variant="outlined" onClick={clearAllFilters} className="clear-filters-btn">
								Clear All Filters
							</Button>
						)}
					</Grid>

					{/* Products Grid with Pagination */}
					<Grid item xs={12} md={9}>
						<Box className="products-grid-container">
							{products.list.length > 0 ? (
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
											page={page}
											onChange={handlePageChange}
											color="primary"
											size="large"
											className="pagination"
										/>
									</Box>
								</>
							) : (
								<Box className="no-products">
									<Typography variant="h6">No products found matching your criteria.</Typography>
									<Button variant="outlined" onClick={clearAllFilters} className="reset-button">
										Reset Filters
									</Button>
								</Box>
							)}
						</Box>
					</Grid>
				</Stack>
			</Container>
		</div>
	);
}
