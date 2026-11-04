import { Stack, Button } from '@mui/material';

interface QuantitySelectorProps {
	quantity: number;
	onIncrement: () => void;
	onDecrement: () => void;
}

export default function QuantitySelector({ quantity, onIncrement, onDecrement }: QuantitySelectorProps) {
	return (
		<Stack className={'quantity-selector'} role="group" aria-label="Quantity">
			<span aria-hidden="true">Quantity:</span>
			<Button
				variant="outlined"
				className="quantity-button"
				onClick={onDecrement}
				disabled={quantity <= 1}
				aria-label="Decrease quantity"
			>
				-
			</Button>
			<span className="quantity-value" aria-live="polite">
				{quantity}
			</span>
			<Button variant="outlined" className="quantity-button" onClick={onIncrement} aria-label="Increase quantity">
				+
			</Button>
		</Stack>
	);
}
