import { createTheme, ThemeOptions } from '@mui/material/styles';
import { TypographyOptions } from '@mui/material/styles/createTypography';
import typography from './typography';

const light: ThemeOptions = {
	palette: {
		mode: 'light',
		background: {
			default: '#FFFFFF',
			paper: '#FFFFFF',
		},
		primary: {
			main: '#E60023',
			contrastText: '#FFFFFF',
		},
		secondary: {
			main: '#EFEFEF',
			contrastText: '#111111',
		},
		text: {
			primary: '#111111',
			secondary: '#767676',
		},
	},
	shape: {
		borderRadius: 16,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 24,
					textTransform: 'none',
					fontWeight: 600,
					padding: '8px 16px',
					'&:hover': {
						backgroundColor: '#AD081B',
					},
				},
				contained: {
					boxShadow: 'none',
					'&:hover': {
						boxShadow: 'none',
					},
				},
				outlined: {
					borderColor: '#EFEFEF',
					'&:hover': {
						borderColor: '#EFEFEF',
						backgroundColor: '#EFEFEF',
					},
				},
			},
		},
		MuiContainer: {
			styleOverrides: {
				root: {
					paddingLeft: '2rem',
					paddingRight: '2rem',
				},
				maxWidthLg: {
					maxWidth: '1400px',
				},
			},
		},
	},
	typography: typography as TypographyOptions,
};

const theme = createTheme(light);

declare module '@mui/material/styles' {
	interface Palette {
		pinterest: {
			red: string;
			black: string;
			gray: string;
			lightgray: string;
		};
		muted: {
			main: string;
			contrastText: string;
		};
	}
	interface PaletteOptions {
		pinterest?: {
			red: string;
			black: string;
			gray: string;
			lightgray: string;
		};
		muted?: {
			main: string;
			contrastText: string;
		};
	}
}

export default theme;
