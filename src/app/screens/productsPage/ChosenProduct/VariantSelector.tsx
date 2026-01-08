import { Stack, Box } from '@mui/material';
import { ProductVariant } from '../../../../libs/types/product';
import Divider from '../../../components/divider';

interface VariantSelectorProps {
	variants: ProductVariant[];
	chosenVariant: ProductVariant;
	onSizeChange: (size: string) => void;
	onColorChange: (color: string) => void;
}

export default function VariantSelector({ variants, chosenVariant, onSizeChange, onColorChange }: VariantSelectorProps) {
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
			<Stack className={'size-options'}>
				<span>Size:</span>
				{availableSizes.map((size) => (
					<Box
						key={size}
						className={`size-option ${chosenVariant?.size === size ? 'selected' : ''} ${
							!availableSizesForColor.includes(size) ? 'disabled' : ''
						}`}
						onClick={() => (!availableSizesForColor.includes(size) ? null : onSizeChange(size))}
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
						onClick={() => (!availableColorsForSize.includes(color) ? null : onColorChange(color))}
					>
						{color}
					</Box>
				))}
			</Stack>
			<Divider height="1" width="100%" bg="#000000" />
		</>
	);
}
