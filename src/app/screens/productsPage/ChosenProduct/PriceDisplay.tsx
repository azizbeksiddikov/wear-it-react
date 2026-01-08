import { Stack } from '@mui/material';

interface PriceDisplayProps {
	productPrice: number;
	salePrice?: number;
	quantity: number;
}

export default function PriceDisplay({ productPrice, salePrice, quantity }: PriceDisplayProps) {
	if (productPrice === 0) return null;

	return (
		<Stack className={'product-price'}>
			<span>Price:</span>
			{salePrice && salePrice !== 0 ? (
				<>
					<span className="sale-price">${salePrice * quantity}</span>
					<span className="original-price">${productPrice * quantity}</span>
				</>
			) : (
				<span>${productPrice * quantity}</span>
			)}
		</Stack>
	);
}
