import { Stack, Button } from '@mui/material';

interface QuantitySelectorProps {
	quantity: number;
	onIncrement: () => void;
	onDecrement: () => void;
}

export default function QuantitySelector({ quantity, onIncrement, onDecrement }: QuantitySelectorProps) {
	return (
		<Stack className={'quantity-selector'}>
			<span>Quantity:</span>
			<Button variant="outlined" className="quantity-button" onClick={onDecrement}>
				-
			</Button>
			<span className="quantity-value">{quantity}</span>
			<Button variant="outlined" className="quantity-button" onClick={onIncrement}>
				+
			</Button>
		</Stack>
	);
}
