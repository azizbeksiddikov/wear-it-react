import { useRef, useState } from 'react';
import { Stack, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface ProductImageSliderProps {
	images: string[];
	productName: string;
}

export default function ProductImageSlider({ images, productName }: ProductImageSliderProps) {
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
							style={{ objectFit: 'contain' }}
						/>
					</SwiperSlide>
				))}
			</Swiper>
			<Box className={'image-previews'}>
				{images.map((image: string, index: number) => (
					<Box
						key={index}
						className={`image-preview ${index === swiperIndex ? 'active' : ''}`}
						onClick={() => swiperRef.current?.swiper.slideTo(index)}
					>
						<img src={image} alt={`${productName} Thumbnail ${index + 1}`} style={{ objectFit: 'contain' }} />
					</Box>
				))}
			</Box>
		</Stack>
	);
}
