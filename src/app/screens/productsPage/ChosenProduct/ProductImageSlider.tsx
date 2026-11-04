import { useRef, useState } from 'react';
import { Stack, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { IMAGE_PLACEHOLDER, handleImageError } from '../../../../libs/image';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface ProductImageSliderProps {
	images: string[];
	productName: string;
}

export default function ProductImageSlider({ images: productImages, productName }: ProductImageSliderProps) {
	const images = productImages && productImages.length > 0 ? productImages : [IMAGE_PLACEHOLDER];
	const [swiperIndex, setSwiperIndex] = useState(0);
	const swiperRef = useRef<any>(null);

	const handleSlideChange = (swiper: any) => {
		setSwiperIndex(swiper.realIndex);
	};

	return (
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
				{images.map((image: string, index: number) => (
					<SwiperSlide key={index}>
						<img
							className="slider-image"
							src={image}
							alt={`${productName} ${index + 1}`}
							loading={index === 0 ? 'eager' : 'lazy'}
							onError={handleImageError}
							style={{ objectFit: 'contain' }}
						/>
					</SwiperSlide>
				))}
			</Swiper>
			<Box className={'image-previews'}>
				{images.map((image: string, index: number) => (
					<button
						type="button"
						key={index}
						className={`image-preview ${index === swiperIndex ? 'active' : ''}`}
						aria-label={`Show photo ${index + 1} of ${images.length}`}
						aria-current={index === swiperIndex}
						onClick={() => swiperRef.current?.swiper.slideToLoop(index)}
					>
						<img src={image} alt="" loading="lazy" onError={handleImageError} style={{ objectFit: 'contain' }} />
					</button>
				))}
			</Box>
		</Stack>
	);
}
