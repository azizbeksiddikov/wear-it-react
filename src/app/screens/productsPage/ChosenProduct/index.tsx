import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

import { Container, Stack, Box, Rating, CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import { setChosenProduct } from '../slice';
import { retrieveChosenProduct } from '../selector';
import ProductService from '../../../services/ProductService';
import { Product, ProductVariant } from '../../../../libs/types/product';
import { CartItem } from '../../../../libs/types/search';
import { useGlobals } from '../../../hooks/useGlobals';

// Import new components
import ProductImageSlider from './ProductImageSlider';
import VariantSelector from './VariantSelector';
import QuantitySelector from './QuantitySelector';
import PriceDisplay from './PriceDisplay';
import ReviewSection from './ReviewSection';

import '../../../../css/productsPage/chosenProduct.css';

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
	const dispatch = useDispatch();
	const { setChosenProduct } = useMemo(() => actionDispatch(dispatch), [dispatch]);
	const { chosenProduct } = useSelector(chosenProductRetriever);
	const navigate = useNavigate();

	const currentProductIdRef = useRef<string>('');
	const prevProductIdRef = useRef<string | undefined>(productId);

	const [isLoading, setIsLoading] = useState(true);
	const [quantity, setQuantity] = useState(1);
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

	const productService = useMemo(() => new ProductService(), []);

	// Fetch product when productId changes
	useEffect(() => {
		if (!productId) return;

		const fetchProduct = async () => {
			// Reset state when productId changes
			if (prevProductIdRef.current !== productId) {
				prevProductIdRef.current = productId;
				setQuantity(1);
				setChosenVariant({
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
			}

			currentProductIdRef.current = productId;
			setIsLoading(true);

			try {
				const product = await productService.getProductById(productId);

				// Check if this is still the current product (prevent race conditions)
				if (currentProductIdRef.current !== productId) return;

				if (!product.productVariants || product.productVariants.length === 0) {
					navigate('/products');
					return;
				}

				setChosenProduct(product);
				setChosenVariant(product.productVariants[0]);
				setIsLoading(false);
			} catch (err) {
				console.error('Error fetching product:', err);
				setIsLoading(false);
				navigate('/products');
			}
		};

		fetchProduct();
	}, [productId, productService, navigate, setChosenProduct]);

	// Refetch function for review handlers
	const refetchProduct = useCallback(() => {
		if (!productId) return;

		productService
			.getProductById(productId)
			.then((product: Product) => {
				if (!product.productVariants || product.productVariants.length === 0) {
					return;
				}

				const variants = product.productVariants;
				setChosenProduct(product);
				setChosenVariant((prev) => {
					// Try to maintain current variant selection if possible
					const matchingVariant = variants.find((v) => v.size === prev.size && v.color === prev.color);
					return matchingVariant || variants[0];
				});
			})
			.catch((err) => {
				console.error('Error refetching product:', err);
			});
	}, [productId, productService, setChosenProduct]);

	// Variant handlers
	const sizeHandler = (size: string) => {
		if (!chosenProduct?.productVariants) return;

		const productVariants = chosenProduct.productVariants;

		setChosenVariant((prevVariant) => {
			const newSize = prevVariant.size === size ? '' : size;

			if (newSize === '') {
				return { ...prevVariant, size: '', productPrice: 0, salePrice: 0 };
			}

			const colorsForNewSize = productVariants
				.filter((variant) => variant.size === newSize)
				.map((variant) => variant.color);

			if (prevVariant.color && colorsForNewSize.includes(prevVariant.color)) {
				const matchingVariant = productVariants.find((v) => v.size === newSize && v.color === prevVariant.color);
				if (matchingVariant) return matchingVariant;
			}

			return { ...prevVariant, size: newSize, productPrice: 0, salePrice: 0 };
		});
	};

	const colorHandler = (color: string) => {
		if (!chosenProduct?.productVariants) return;

		const productVariants = chosenProduct.productVariants;

		setChosenVariant((prevVariant) => {
			const newColor = prevVariant.color === color ? '' : color;

			if (newColor === '') {
				return { ...prevVariant, color: '', productPrice: 0, salePrice: 0 };
			}

			const sizesForNewColor = productVariants
				.filter((variant) => variant.color === newColor)
				.map((variant) => variant.size);

			if (prevVariant.size && sizesForNewColor.includes(prevVariant.size)) {
				const matchingVariant = productVariants.find((v) => v.color === newColor && v.size === prevVariant.size);
				if (matchingVariant) return matchingVariant;
			}

			return { ...prevVariant, color: newColor, productPrice: 0, salePrice: 0 };
		});
	};

	const incrementQuantityHandler = () => {
		setQuantity(quantity + 1);
	};

	const decrementQuantityHandler = () => {
		if (quantity > 0) {
			setQuantity(quantity - 1);
		}
	};

	const handleAddToBasket = () => {
		if (chosenVariant.productPrice === 0 || !productId) return;

		onAdd({
			productId: productId,
			variantId: chosenVariant._id,
			productName: chosenProduct!.productName,
			productCategory: chosenProduct!.productCategory,
			productGender: chosenProduct!.productGender,
			productImage: chosenProduct!.productImages[0],
			productSize: chosenVariant.size,
			productColor: chosenVariant.color,
			itemUnitPrice: chosenVariant.productPrice,
			salePrice: chosenVariant?.salePrice ?? null,
			itemQuantity: quantity,
		});
		setQuantity(1);
	};

	if (isLoading) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '60vh',
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (!chosenProduct || !chosenProduct.productVariants || !chosenProduct.productVariants.length || !chosenVariant)
		return null;

	return (
		<div className={'chosen-product'}>
			<Box className={'title'}>Product Detail</Box>
			<Container>
				<Stack className={'product-container'}>
					{/* Product Image Slider */}
					<ProductImageSlider images={chosenProduct.productImages} productName={chosenProduct.productName} />

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

							{/* Variant Selector */}
							<VariantSelector
								variants={chosenProduct.productVariants}
								chosenVariant={chosenVariant}
								onSizeChange={sizeHandler}
								onColorChange={colorHandler}
							/>

							{/* Quantity Selector */}
							<QuantitySelector
								quantity={quantity}
								onIncrement={incrementQuantityHandler}
								onDecrement={decrementQuantityHandler}
							/>

							{/* Price Display */}
							<PriceDisplay
								productPrice={chosenVariant.productPrice}
								salePrice={chosenVariant.salePrice}
								quantity={quantity}
							/>

							{/* Add to Basket Button */}
							<div className={'button-box'}>
								<Button
									onClick={handleAddToBasket}
									style={{
										backgroundColor: authMember ? '#4caf50' : '#9e9e9e',
										color: 'white',
									}}
									variant="contained"
									disabled={!authMember}
								>
									Add To Basket
								</Button>
							</div>
						</Stack>
					</Stack>
				</Stack>

				{/* Review Section */}
				<ReviewSection
					productId={productId!}
					memberReview={chosenProduct.memberReview}
					productReviews={chosenProduct.productReviews}
					isReviewValid={chosenProduct.isReviewValid}
					authMember={authMember}
					onRefetch={refetchProduct}
				/>
			</Container>
		</div>
	);
}
