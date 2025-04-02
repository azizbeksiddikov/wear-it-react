import { TypographyOptions } from '@mui/material/styles/createTypography';

const typography: TypographyOptions = {
	fontFamily: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'].join(','),
	h1: {
		fontWeight: 600,
		fontSize: '28px',
		lineHeight: 1.2,
	},
	h2: {
		fontWeight: 600,
		fontSize: '24px',
		lineHeight: 1.2,
	},
	h3: {
		fontWeight: 600,
		fontSize: '20px',
		lineHeight: 1.2,
	},
	body1: {
		fontSize: '16px',
		lineHeight: 1.5,
	},
	button: {
		textTransform: 'none' as const,
		fontWeight: 600,
		fontSize: '16px',
	},
};

export default typography;
