import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app/App';
import ErrorBoundary from './app/components/errorBoundary';
import ContextProvider from './app/context/ContextProvider';
import theme from './app/MaterialTheme';
import { store } from './app/store';
import './css/index.css';
import reportWebVitals from './reportWebVitals';

// Configure axios to send credentials with all requests
axios.defaults.withCredentials = true;

const container = document.getElementById('root')!;
const root = createRoot(container);
// One quick retry, then show the error state instead of leaving the shopper waiting
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1 } } });

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<ContextProvider>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<ErrorBoundary>
							<Router>
								<App />
							</Router>
						</ErrorBoundary>
					</ThemeProvider>
				</QueryClientProvider>
			</ContextProvider>
		</Provider>
	</React.StrictMode>,
);

reportWebVitals();
