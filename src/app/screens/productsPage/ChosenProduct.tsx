import React, { useState, useEffect, useRef } from 'react';
import { Container, Stack, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Divider from '../../components/divider';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper';
import { Dispatch } from '@reduxjs/toolkit';
import { setChosenProduct } from './slice';
import { Product, ProductVariant } from '../../../libs/types/product';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { retrieveChosenProduct } from './selector';
import ProductService from '../../services/ProductServices';
import { useParams, useHistory } from 'react-router-dom';
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
	const { chosenProduct }: { chosenProduct: Product | null } = useSelector(chosenProductRetriever);

	const [chosenVariant, setChosenVariant] = useState<ProductVariant>();
	const [selectedSize, setSelectedSize] = useState('');
	const [selectedColor, setSelectedColor] = useState('');
	const [selectedPrice, setSelectedPrice] = useState<number>();
	const [quantity, setQuantity] = useState(1);
	const [swiperIndex, setSwiperIndex] = useState(0);
	const history = useHistory();

	const swiperRef = useRef<any>(null);

	useEffect(() => {
		const productService = new ProductService();
		productService
			.getProductById(productId)
			.then((data) => {
				setChosenProduct(data);
				if (!data.productVariants || data.productVariants.length === 0) {
					history.push('/products');
					return;
				}

				if (data.productVariants && data.productVariants.length > 0) {
					const firstColor = data.productVariants[0].color;
					setSelectedColor(firstColor);

					// Calculate available sizes for this color directly from data
					const sizesForFirstColor = [
						...new Set(
							data.productVariants.filter((variant) => variant.color === firstColor).map((variant) => variant.size),
						),
					];

					if (sizesForFirstColor.length > 0) {
						setSelectedSize(sizesForFirstColor[0]);
						setChosenVariant(data.productVariants[0]);
					}
				}
			})
			.catch((err) => console.log(err));
	}, []);

	useEffect(() => {
		if (!chosenProduct || !chosenProduct.productVariants || !chosenProduct.productVariants.length) return;

		const selectedVariant = chosenProduct.productVariants.find(
			(variant) => variant.size === selectedSize && variant.color === selectedColor,
		);

		if (selectedVariant) {
			setChosenVariant(selectedVariant);

			setSelectedPrice(selectedVariant.productPrice);
			if (selectedVariant.salePrice) {
				setSelectedPrice(selectedVariant.salePrice);
			}
		}
	}, [selectedSize, selectedColor]);

	if (!chosenProduct || !chosenProduct.productVariants || !chosenProduct.productVariants.length) return;

	// Handlers
	const handleSizeChange = (size: string) => {
		setSelectedSize((prevSize) => (prevSize === size ? '' : size));
	};

	const handleColorChange = (color: string) => {
		setSelectedColor((prevColor) => (prevColor === color ? '' : color));
	};

	const handleIncrementQuantity = () => {
		setQuantity(quantity + 1);
	};

	const handleDecrementQuantity = () => {
		if (quantity > 0) {
			setQuantity(quantity - 1);
		}
	};

	// Extract unique sizes and colors from product variants
	const availableSizes = [...new Set(chosenProduct.productVariants.map((variant) => variant.size))];
	const availableColors = [...new Set(chosenProduct.productVariants.map((variant) => variant.color))];

	// Get available colors for the selected size
	const availableColorsForSize = selectedSize
		? [
				...new Set(
					chosenProduct.productVariants
						.filter((variant) => variant.size === selectedSize)
						.map((variant) => variant.color),
				),
		  ]
		: availableColors;

	// Get available sizes for the selected color
	const availableSizesForColor = selectedColor
		? [
				...new Set(
					chosenProduct.productVariants
						.filter((variant) => variant.color === selectedColor)
						.map((variant) => variant.size),
				),
		  ]
		: availableSizes;

	const handleSlideChange = () => {
		if (swiperRef.current) {
			setSwiperIndex(swiperRef.current.swiper.realIndex);
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
					<Box className={'info-box'}>
						<strong className={'product-name'}>{chosenProduct.productName}</strong>
						<Box className={'category-box'}>
							<span>{chosenProduct.productCategory}</span>
							{chosenProduct.isFeatured && <span className="feature-badge">Featured</span>}
							{chosenProduct.onSale && <span className="on-sale-badge">On Sale</span>}
						</Box>
						<Box className={'rating-box'}>
							<Rating name="half-rating" defaultValue={chosenProduct.reviewsRating ?? 0} precision={0.5} readOnly />
							<div className={'evaluation-box'}>
								<div className={'product-view'}>
									<RemoveRedEyeIcon sx={{ mr: '10px' }} />
									<span>{chosenProduct.productViews ?? 0}</span>
								</div>
							</div>
						</Box>
						<p className={'product-desc'}>{chosenProduct.productDesc}</p>
						{/* Size selection */}
						<Box className={'size-options'}>
							<span>Size:</span>
							{availableSizes.map((size) => (
								<Box
									key={size}
									className={`size-option ${selectedSize === size ? 'selected' : ''} ${
										!availableSizesForColor.includes(size) ? 'disabled' : ''
									}`}
									onClick={() => (!availableSizesForColor.includes(size) ? null : handleSizeChange(size))}
								>
									{size}
								</Box>
							))}
						</Box>

						{/* Color selection */}
						<Box className={'color-options'}>
							<span>Color:</span>
							{availableColors.map((color) => (
								<Box
									key={color}
									className={`color-option ${selectedColor === color ? 'selected' : ''} ${
										!availableColorsForSize.includes(color) ? 'disabled' : ''
									}`}
									onClick={() => (!availableColorsForSize.includes(color) ? null : handleColorChange(color))}
								>
									{color}
								</Box>
							))}
						</Box>
						<Divider height="1" width="100%" bg="#000000" />
						{/* Quantity selection */}
						<Box className={'quantity-selector'}>
							<span>Quantity:</span>
							<Button variant="outlined" className="quantity-button" onClick={handleDecrementQuantity}>
								-
							</Button>
							<span className="quantity-value">{quantity}</span>
							<Button variant="outlined" className="quantity-button" onClick={handleIncrementQuantity}>
								+
							</Button>
						</Box>
						{selectedSize && selectedColor && (
							<div className={'product-price'}>
								<span>Price:</span>
								{chosenProduct.productVariants.find(
									(variant) => variant.size === selectedSize && variant.color === selectedColor,
								)?.salePrice ? (
									<>
										<span className="sale-price">${selectedPrice * quantity}</span>
										<span className="original-price">${chosenProduct.productVariants[0].productPrice * quantity}</span>
									</>
								) : (
									<span>${selectedPrice * quantity}</span>
								)}
							</div>
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
								}}
								style={{ backgroundColor: '#4caf50', color: 'white' }}
								variant="contained"
							>
								Add To Basket
							</Button>
						</div>
					</Box>
				</Stack>
			</Container>
		</div>
	);
}
