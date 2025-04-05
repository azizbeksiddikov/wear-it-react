import React, { useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import { Dispatch } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { setChosenProduct } from './slice';
import { retrieveChosenProduct } from './selector';

import { Container, Stack, Box } from '@mui/material';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import Divider from '../../components/divider';
import ProductService from '../../services/ProductServices';
import { Product, ProductVariant } from '../../../libs/types/product';
import { CartItem } from '../../../libs/types/search';

import '../../../css/productsPage/chosenProduct.css';

const actionDispatch = (dispatch: Dispatch) => ({
	setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
});
const chosenProductRetriever = createSelector(retrieveChosenProduct, (chosenProduct) => ({ chosenProduct }));

interface ChosenProductProps {
	onAdd: (item: CartItem) => void;
}
export default function ChosenProduct(props: ChosenProductProps) {
	const { onAdd } = props;
	const { productId } = useParams<{ productId: string }>();
	const { setChosenProduct } = actionDispatch(useDispatch());
	const { chosenProduct } = useSelector(chosenProductRetriever);
	const [swiperIndex, setSwiperIndex] = useState(0);
	const swiperRef = useRef<any>(null);
	const history = useHistory();
	const productService = new ProductService();

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

	useQuery({
		queryKey: ['product', productId],
		queryFn: async () => {
			const data: Product = await productService.getProductById(productId);

			if (!data.productVariants || data.productVariants.length === 0) {
				history.push('/products');
				return null;
			}
			setChosenProduct(data);
			setChosenVariant(data.productVariants[0]);
			return data;
		},
		retry: false,
		staleTime: 1 * 60 * 1000,
	});

	if (!chosenProduct || !chosenProduct.productVariants || !chosenProduct.productVariants.length || !chosenVariant)
		return;

	// Handlers
	const sizeHandler = (size: string) => {
		const newSize = chosenVariant.size === size ? '' : size;

		if (newSize === '') {
			setChosenVariant({ ...chosenVariant, size: newSize, productPrice: 0, salePrice: 0 });
			return;
		}

		const newColor = chosenVariant.color === '' ? '' : chosenVariant.color;

		if (newColor !== '' && availableColorsForSize.includes(newColor)) {
			const newVariant = chosenProduct.productVariants.find(
				(variant) => variant.size === newSize && variant.color === newColor,
			);
			if (newVariant) {
				setChosenVariant(newVariant);
			}
		} else {
			setChosenVariant({ ...chosenVariant, size: newSize, color: '', productPrice: 0, salePrice: 0 });
		}
	};

	const colorHandler = (color: string) => {
		const newColor = chosenVariant.color === color ? '' : color;

		if (newColor === '') {
			setChosenVariant({ ...chosenVariant, color: newColor, productPrice: 0, salePrice: 0 });
			return;
		}

		const newSize = chosenVariant.size === '' ? '' : chosenVariant.size;

		if (newSize !== '' && availableSizesForColor.includes(newSize)) {
			const newVariant = chosenProduct.productVariants.find(
				(variant) => variant.color === newColor && variant.size === newSize,
			);
			if (newVariant) {
				setChosenVariant(newVariant);
			}
		} else {
			setChosenVariant({ ...chosenVariant, color: newColor, size: newSize, productPrice: 0, salePrice: 0 });
		}
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

	const handleSlideChange = () => {
		if (swiperRef.current) {
			setSwiperIndex(swiperRef.current.swiper.realIndex);
		}
	};

	const incrementQuantityHandler = () => {
		setQuantity(quantity + 1);
	};

	const decrementQuantityHandler = () => {
		if (quantity > 0) {
			setQuantity(quantity - 1);
		}
	};
	return (
		<div className={'chosen-product'}>
			<Box className={'title'}>Product Detail</Box>
			<Container className={'product-container'}>
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
							<Rating name="half-rating" defaultValue={chosenProduct.reviewsRating ?? 0} precision={0.5} readOnly />
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
								style={{ backgroundColor: '#4caf50', color: 'white' }}
								variant="contained"
							>
								Add To Basket
							</Button>
						</div>
					</Stack>
				</Stack>
			</Container>
		</div>
	);
}
