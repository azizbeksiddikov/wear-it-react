import { Stack } from '@mui/material';
import { ProductVariant } from '../../../../libs/types/product';
import Divider from '../../../components/divider';

interface VariantSelectorProps {
	variants: ProductVariant[];
	chosenVariant: ProductVariant;
	onSizeChange: (size: string) => void;
	onColorChange: (color: string) => void;
}

export default function VariantSelector({
	variants,
	chosenVariant,
	onSizeChange,
	onColorChange,
}: VariantSelectorProps) {
	// Extract unique sizes and colors
	const availableSizes = [...new Set(variants.map((variant) => variant.size))];
	const availableColors = [...new Set(variants.map((variant) => variant.color))];

	// Get available colors for the selected size
	const availableColorsForSize = chosenVariant.size
		? [...new Set(variants.filter((variant) => variant.size === chosenVariant.size).map((variant) => variant.color))]
		: availableColors;

	// Get available sizes for the selected color
	const availableSizesForColor = chosenVariant.color
		? [...new Set(variants.filter((variant) => variant.color === chosenVariant.color).map((variant) => variant.size))]
		: availableSizes;

	return (
		<>
			{/* Size selection */}
			<Stack className={'size-options'} role="group" aria-labelledby="size-label">
				<span id="size-label">Size:</span>
				{availableSizes.map((size) => {
					const unavailable = !availableSizesForColor.includes(size);
					return (
						<button
							type="button"
							key={size}
							className={`size-option ${chosenVariant?.size === size ? 'selected' : ''} ${unavailable ? 'disabled' : ''}`}
							aria-pressed={chosenVariant?.size === size}
							disabled={unavailable}
							onClick={() => onSizeChange(size)}
						>
							{size}
						</button>
					);
				})}
			</Stack>

			{/* Color selection */}
			<Stack className={'color-options'} role="group" aria-labelledby="color-label">
				<span id="color-label">Color:</span>
				{availableColors.map((color) => {
					const unavailable = !availableColorsForSize.includes(color);
					return (
						<button
							type="button"
							key={color}
							className={`color-option ${chosenVariant?.color === color ? 'selected' : ''} ${unavailable ? 'disabled' : ''}`}
							aria-pressed={chosenVariant?.color === color}
							disabled={unavailable}
							onClick={() => onColorChange(color)}
						>
							{color}
						</button>
					);
				})}
			</Stack>
			<Divider height="1" width="100%" bg="#000000" />
		</>
	);
}
