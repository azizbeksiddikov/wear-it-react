import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Dispatch } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { setChosenProduct } from './slice';
import { retrieveChosenProduct } from './selector';

import { Container, Stack, Box, Typography, TextField, Rating, List, ListItem, Card, CardContent } from '@mui/material';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Button from '@mui/material/Button';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { T } from '../../../libs/types/common';
import Divider from '../../components/divider';
import ProductService from '../../services/ProductService';
import ReviewService from '../../services/ReviewService';
import { Product, ProductVariant } from '../../../libs/types/product';
import { CartItem } from '../../../libs/types/search';
import { ReviewInput, ReviewUpdateInput } from '../../../libs/types/review';

import '../../../css/productsPage/chosenProduct.css';
import { useGlobals } from '../../hooks/useGlobals';

const actionDispatch = (dispatch: Dispatch) => ({
	setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
});
const chosenProductRetriever = createSelector(retrieveChosenProduct, (chosenProduct) => ({ chosenProduct }));

interface ChosenProductProps {
	onAdd: (item: CartItem) => void;
}
export default function ChosenProduct(props: ChosenProductProps) {
	const { onAdd } = props;
	const { authMember } = useGlobals();
	const { productId } = useParams<{ productId: string }>();
	const { setChosenProduct } = actionDispatch(useDispatch());
	const { chosenProduct } = useSelector(chosenProductRetriever);

	const [swiperIndex, setSwiperIndex] = useState(0);
	const swiperRef = useRef<any>(null);
	const history = useHistory();

	const [reviewModalOpen, setReviewModalOpen] = useState(false);
	const [isEditingReview, setIsEditingReview] = useState(false);

	const productService = useMemo(() => new ProductService(), []);
	const reviewService = useMemo(() => new ReviewService(), []);

	const [chosenVariant, setChosenVariant] = useState<ProductVariant>({
		_id: '',
		productId: '',
		size: '',
		color: '',
		productPrice: 0,
		stockQuantity: 0,
		salePrice: undefined,
		createdAt: new Date(),
		updatedAt: new Date(),
	});
	const [quantity, setQuantity] = useState(1);
	const [reviewUpdate, setReviewUpdate] = useState({
		rating: chosenProduct?.memberReview?.rating ?? 0,
		comment: chosenProduct?.memberReview?.comment ?? '',
	});

	const fetchProduct = useCallback(
		(id: string) => {
			productService
				.getProductById(id)
				.then((product: Product) => {
					if (!product.productVariants || product.productVariants.length === 0) {
						history.push('/products');
						return;
					}

					setChosenProduct(product);
					setChosenVariant(product.productVariants[0]);

					setReviewUpdate({
						rating: product.memberReview?.rating ?? 0,
						comment: product.memberReview?.comment ?? '',
					});
				})
				.catch((err) => {
					console.error('Error fetching product:', err);
					history.push('/products');
				});
		},
		[productService, history, setChosenProduct],
	);

	useEffect(() => {
		setQuantity(1);
		setSwiperIndex(0);
		setIsEditingReview(false);

		// Fetch product data
		fetchProduct(productId);
	}, [fetchProduct, productId]);

	if (!chosenProduct || !chosenProduct.productVariants || !chosenProduct.productVariants.length || !chosenVariant)
		return;

	// Handlers
	const sizeHandler = (size: string) => {
		// Check if the size was already selected
		const newSize = chosenVariant.size === size ? '' : size;

		let updatedVariant;

		// if size is deselected, reset the variant
		if (newSize === '') {
			updatedVariant = { ...chosenVariant, size: '', productPrice: 0, salePrice: 0 };
		} else if (
			chosenVariant.color &&
			chosenVariant.color !== '' &&
			availableColorsForSize.includes(chosenVariant.color)
		) {
			updatedVariant = chosenProduct.productVariants?.find(
				(v) => v.size === newSize && v.color === chosenVariant.color,
			) || { ...chosenVariant, size: newSize };
		} else {
			// if size is selected and color is not selected
			updatedVariant = { ...chosenVariant, size: newSize, productPrice: 0, salePrice: 0 };
		}
		setChosenVariant(updatedVariant);
	};

	const colorHandler = (color: string) => {
		// Check if the color is already selected
		const newColor = chosenVariant.color === color ? '' : color;

		let updatedVariant;

		// if color is deselected, reset the variant
		if (newColor === '') {
			updatedVariant = { ...chosenVariant, color: '', productPrice: 0, salePrice: 0 };
		} else if (chosenVariant.size && chosenVariant.size !== '' && availableSizesForColor.includes(chosenVariant.size)) {
			updatedVariant = chosenProduct.productVariants?.find(
				(v) => v.color === newColor && v.size === chosenVariant.size,
			) || { ...chosenVariant, color: newColor };
		} else {
			// if color is selected and size is not selected or not available
			updatedVariant = { ...chosenVariant, color: newColor, productPrice: 0, salePrice: 0 };
		}

		setChosenVariant(updatedVariant);
	};

	// Extract unique sizes and colors from product variants
	const availableSizes = [...new Set(chosenProduct.productVariants.map((variant) => variant.size))];
	const availableColors = [...new Set(chosenProduct.productVariants.map((variant) => variant.color))];

	// Get available colors for the selected size
	const availableColorsForSize = chosenVariant.size
		? [
				...new Set(
					chosenProduct.productVariants
						.filter((variant) => variant.size === chosenVariant.size)
						.map((variant) => variant.color),
				),
		  ]
		: availableColors;

	// Get available sizes for the selected color
	const availableSizesForColor = chosenVariant.color
		? [
				...new Set(
					chosenProduct.productVariants
						.filter((variant) => variant.color === chosenVariant.color)
						.map((variant) => variant.size),
				),
		  ]
		: availableSizes;

	const handleSlideChange = (swiper) => {
		setSwiperIndex(swiper.realIndex);
	};

	const incrementQuantityHandler = () => {
		setQuantity(quantity + 1);
	};

	const decrementQuantityHandler = () => {
		if (quantity > 0) {
			setQuantity(quantity - 1);
		}
	};

	const handleOpenReviewModal = () => {
		setReviewModalOpen(true);
	};

	const handleCloseReviewModal = () => {
		setReviewModalOpen(false);
	};

	const handleRatingChange = (e: T) => {
		setReviewUpdate({
			...reviewUpdate,
			rating: Number(e.target.value) ? Number(e.target.value) : 0,
		});
	};
	const handleCommentChange = (e: T) => {
		setReviewUpdate({
			...reviewUpdate,
			comment: e.target.value,
		});
	};

	const handleCreateReview = () => {
		const reviewData: ReviewInput = {
			productId,
			rating: reviewUpdate.rating as number,
			comment: reviewUpdate.comment.trim() || undefined,
		};

		reviewService
			.createReview(reviewData)
			.then((data) => {
				setReviewModalOpen(false);
				fetchProduct(productId);
			})
			.catch((err) => {
				console.error('Error creating review:', err);
			});
	};

	const handleUpdateReview = () => {
		if (!chosenProduct?.memberReview) return;

		const reviewData: ReviewUpdateInput = {
			_id: chosenProduct.memberReview._id,
			rating: reviewUpdate.rating as number,
			comment: reviewUpdate.comment.trim() || undefined,
		};

		reviewService
			.updateReview(reviewData)
			.then((data) => {
				setIsEditingReview(false);
				fetchProduct(productId);
			})
			.catch((err) => {
				console.error('Error updating review:', err);
			});
	};

	const handleDeleteReview = () => {
		if (!chosenProduct?.memberReview) return;
		reviewService
			.deleteReview(chosenProduct.memberReview._id)
			.then(() => {
				fetchProduct(productId);
			})
			.catch((err) => {
				console.error('Error deleting review:', err);
			});
	};

	const handleEditReview = () => {
		setIsEditingReview(true);
	};

	return (
		<div className={'chosen-product'}>
			<Box className={'title'}>Product Detail</Box>
			<Container>
				<Stack className={'product-container'}>
					{/* Product Image Slider */}
					<Stack className={'chosen-product-slider'}>
						<Swiper
							loop={true}
							spaceBetween={10}
							navigation={true}
							modules={[FreeMode, Navigation, Thumbs]}
							className="swiper-area"
							onSlideChange={handleSlideChange}
							ref={swiperRef}
						>
							{chosenProduct.productImages.map((ele: string, index: number) => {
								return (
									<SwiperSlide key={index}>
										<img className="slider-image" src={ele} alt="" style={{ objectFit: 'contain' }} />
									</SwiperSlide>
								);
							})}
						</Swiper>
						<Box className={'image-previews'}>
							{chosenProduct.productImages.map((ele: string, index: number) => (
								<Box
									key={index}
									className={`image-preview ${index === swiperIndex ? 'active' : ''}`}
									onClick={() => swiperRef.current?.swiper.slideTo(index)}
								>
									<img src={ele} alt={`Product Thumbnail ${index + 1}`} style={{ objectFit: 'contain' }} />
								</Box>
							))}
						</Box>
					</Stack>

					{/* Product Info */}
					<Stack className={'chosen-product-info'}>
						<Stack className={'info-box'}>
							<Box className={'product-name'}>{chosenProduct.productName}</Box>
							<Stack className={'category-box'}>
								<span>{chosenProduct.productCategory}</span>
								{chosenProduct.isFeatured && <span className="feature-badge">Featured</span>}
								{chosenProduct.onSale && <span className="on-sale-badge">On Sale</span>}
							</Stack>
							<Stack className={'rating-box'}>
								<Rating name="half-rating" value={chosenProduct.reviewsRating ?? 0} precision={0.5} readOnly />

								<div className={'evaluation-box'}>
									<div className={'product-view'}>
										<RemoveRedEyeIcon sx={{ mr: '10px' }} />
										<span>{chosenProduct.productViews ?? 0}</span>
									</div>
								</div>
							</Stack>
							<p className={'product-desc'}>{chosenProduct.productDesc}</p>
							{/* Size selection */}
							<Stack className={'size-options'}>
								<span>Size:</span>
								{availableSizes.map((size) => (
									<Box
										key={size}
										className={`size-option ${chosenVariant?.size === size ? 'selected' : ''} ${
											!availableSizesForColor.includes(size) ? 'disabled' : ''
										}`}
										onClick={() => (!availableSizesForColor.includes(size) ? null : sizeHandler(size))}
									>
										{size}
									</Box>
								))}
							</Stack>

							{/* Color selection */}
							<Stack className={'color-options'}>
								<span>Color:</span>
								{availableColors.map((color) => (
									<Box
										key={color}
										className={`color-option ${chosenVariant?.color === color ? 'selected' : ''} ${
											!availableColorsForSize.includes(color) ? 'disabled' : ''
										}`}
										onClick={() => (!availableColorsForSize.includes(color) ? null : colorHandler(color))}
									>
										{color}
									</Box>
								))}
							</Stack>
							<Divider height="1" width="100%" bg="#000000" />
							{/* Quantity selection */}
							<Stack className={'quantity-selector'}>
								<span>Quantity:</span>
								<Button variant="outlined" className="quantity-button" onClick={decrementQuantityHandler}>
									-
								</Button>
								<span className="quantity-value">{quantity}</span>
								<Button variant="outlined" className="quantity-button" onClick={incrementQuantityHandler}>
									+
								</Button>
							</Stack>

							{/* Price display */}
							{chosenVariant && (
								<Stack className={'product-price'}>
									<span>Price:</span>
									{chosenVariant?.salePrice && chosenVariant.salePrice !== 0 ? (
										<>
											<span className="sale-price">${chosenVariant.salePrice * quantity}</span>
											<span className="original-price">${chosenVariant?.productPrice * quantity}</span>
										</>
									) : chosenVariant?.productPrice && chosenVariant.productPrice !== 0 ? (
										<span>${chosenVariant.productPrice * quantity}</span>
									) : (
										<></>
									)}
								</Stack>
							)}

							<div className={'button-box'}>
								<Button
									onClick={() => {
										if (chosenVariant.productPrice === 0) {
											return;
										}
										onAdd({
											productId: productId,
											variantId: chosenVariant._id,
											productName: chosenProduct.productName,
											productCategory: chosenProduct.productCategory,
											productGender: chosenProduct.productGender,
											productImage: chosenProduct.productImages[0],
											productSize: chosenVariant.size,
											productColor: chosenVariant.color,
											itemUnitPrice: chosenVariant.productPrice,
											salePrice: chosenVariant?.salePrice ?? null,
											itemQuantity: quantity,
										});
										setQuantity(1);
									}}
									style={{
										backgroundColor: authMember ? '#4caf50' : '#9e9e9e',
										color: 'white',
									}}
									variant="contained"
									disabled={!authMember}
								>
									Add To Basket
								</Button>

								{!chosenProduct?.memberReview && (
									<Button
										style={{
											backgroundColor: !authMember || chosenProduct?.isReviewValid === false ? '#9e9e9e' : '#2196f3',
											color: 'white',
										}}
										variant="contained"
										onClick={handleOpenReviewModal}
										disabled={!authMember || chosenProduct?.isReviewValid === false}
									>
										Write Review
									</Button>
								)}
							</div>
						</Stack>
					</Stack>
				</Stack>

				{/* My Review */}
				{chosenProduct?.memberReview && (
					<Box mb={3} className="user-review">
						<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
							<Typography variant="h6">Your Review</Typography>
							<Box display="flex" gap={1}>
								{!isEditingReview ? (
									<>
										<Button variant="outlined" size="small" onClick={handleEditReview}>
											Edit
										</Button>
										<Button
											variant="outlined"
											color="error"
											size="small"
											startIcon={<DeleteIcon />}
											onClick={handleDeleteReview}
										>
											Delete
										</Button>
									</>
								) : (
									<Button variant="contained" color="primary" size="small" onClick={handleUpdateReview}>
										Save
									</Button>
								)}
							</Box>
						</Box>
						<Card className="review-card">
							<CardContent>
								<Stack spacing={2}>
									{!isEditingReview ? (
										<>
											<Rating value={reviewUpdate.rating} readOnly precision={0.5} />
											{reviewUpdate?.comment && <Typography variant="body1">{reviewUpdate.comment}</Typography>}
										</>
									) : (
										<>
											<Rating value={reviewUpdate.rating} onChange={(e) => handleRatingChange(e)} />
											<TextField
												fullWidth
												multiline
												rows={3}
												variant="outlined"
												label="Your Review"
												value={reviewUpdate?.comment}
												onChange={(e) => handleCommentChange(e)}
											/>
										</>
									)}
								</Stack>
							</CardContent>
						</Card>
					</Box>
				)}

				{/* Other Reviews */}
				<Stack className="other-reviews" spacing={2}>
					{chosenProduct?.productReviews && chosenProduct.productReviews.length > 0 ? (
						<>
							<Typography variant="h6">
								Other Reviews (
								{
									chosenProduct.productReviews.filter(
										(review) => review.memberId !== chosenProduct.memberReview?.memberId,
									).length
								}
								)
							</Typography>
							<List disablePadding>
								{chosenProduct.productReviews
									.filter((review) => review.memberId !== chosenProduct.memberReview?.memberId)
									.map((review) => (
										<ListItem key={review._id} disableGutters disablePadding sx={{ display: 'block', mb: 2 }}>
											<Card className="review-card">
												<CardContent>
													<Box
														className="review-header"
														sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
													>
														<Rating value={review.rating} readOnly precision={0.5} />
														{review.createdAt && (
															<Typography variant="body2" color="textSecondary">
																{new Date(review.createdAt).toLocaleDateString()}
															</Typography>
														)}
													</Box>

													{/* User info with avatar */}
													<Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
														<Box
															component="img"
															src={review.memberData?.memberImage || '/img/default-user.webp'}
															alt="User"
															sx={{
																width: 36,
																height: 36,
																borderRadius: '50%',
																mr: 1.5,
																objectFit: 'cover',
															}}
															onError={(e) => {
																e.currentTarget.src = '/icons/default-user.svg';
															}}
														/>
														<Typography variant="subtitle2" gutterBottom sx={{ m: 0 }}>
															{review.memberData?.memberFullName || review.memberData?.memberEmail || 'Anonymous'}
														</Typography>
													</Box>

													{review?.comment && <Typography variant="body1">{review.comment}</Typography>}
												</CardContent>
											</Card>
										</ListItem>
									))}
							</List>
						</>
					) : (
						<Stack className="no-reviews">
							<Typography variant="h6">Other Reviews</Typography>
							<Typography variant="body2" className="empty-reviews-message">
								No other reviews yet
							</Typography>
						</Stack>
					)}
				</Stack>
			</Container>

			{/* Create Review Modal */}
			<Dialog
				open={reviewModalOpen}
				onClose={() => {
					setReviewModalOpen(false);
				}}
				fullWidth
				maxWidth="sm"
				className="review-modal"
			>
				<DialogTitle className="review-modal-title">Write a Review</DialogTitle>
				<DialogContent>
					<Box sx={{ my: 2 }}>
						<Typography component="legend">Your Rating</Typography>
						<Rating
							name="product-rating"
							value={reviewUpdate.rating}
							onChange={handleRatingChange} // Pass the function directly, not a new arrow function
							size="large"
							sx={{ my: 1 }}
						/>
						<TextField
							label="Your Review (optional)"
							multiline
							rows={4}
							value={reviewUpdate?.comment}
							onChange={(e) => handleCommentChange(e)}
							fullWidth
							variant="outlined"
							placeholder="Share your experience with this product..."
							sx={{ mt: 2 }}
							inputProps={{ maxLength: 500 }}
						/>
						{reviewUpdate?.comment && (
							<Typography variant="caption" color="text.secondary" align="right" display="block" sx={{ mt: 0.5 }}>
								{reviewUpdate?.comment.length}/500
							</Typography>
						)}
					</Box>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 3 }}>
					<Button onClick={handleCloseReviewModal} variant="outlined">
						Cancel
					</Button>
					<Button onClick={handleCreateReview} variant="contained" color="primary" disabled={!reviewUpdate.rating}>
						Submit Review
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
