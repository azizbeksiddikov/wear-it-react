import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './app/MaterialTheme';
import { BrowserRouter as Router } from 'react-router-dom';
import ContextProvider from './app/context/ContextProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import './css/index.css';

// Configure axios to send credentials with all requests
axios.defaults.withCredentials = true;

const container = document.getElementById('root')!;
const root = createRoot(container);
const queryClient = new QueryClient();

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<ContextProvider>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<Router>
							<App />
						</Router>
					</ThemeProvider>
				</QueryClientProvider>
			</ContextProvider>
		</Provider>
		,
	</React.StrictMode>,
);

reportWebVitals();
// <React.StrictMode> -renders twice!
