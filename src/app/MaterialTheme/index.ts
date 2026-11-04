import { createTheme, ThemeOptions } from '@mui/material/styles';
import typography from './typography';

const light: ThemeOptions = {
	palette: {
		mode: 'light',
		background: {
			default: '#FFFFFF',
			paper: '#FFFFFF',
		},
		primary: {
			main: '#E60023', // Pinterest red
			light: '#FF4D72',
			dark: '#AD081B',
			contrastText: '#FFFFFF',
		},
		secondary: {
			main: '#EFEFEF', // Pinterest light gray
			light: '#F7F7F7',
			dark: '#DADADA',
			contrastText: '#111111',
		},
		text: {
			primary: '#111111', // Pinterest dark text
			secondary: '#6b6b6b', // Pinterest secondary text
		},
		// Adding Pinterest specific colors
		pinterest: {
			red: '#E60023',
			black: '#111111',
			gray: '#6b6b6b',
			lightgray: '#EFEFEF',
		},
		// Adding muted color for less prominent elements
		muted: {
			main: '#EFEFEF',
			contrastText: '#6b6b6b',
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
					'@media (max-width:600px)': {
						paddingLeft: '16px',
						paddingRight: '16px',
					},
				},
				maxWidthLg: {
					maxWidth: '1400px',
				},
			},
		},
	},
	typography: typography as ThemeOptions['typography'],
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
