import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Component, ErrorInfo, ReactNode } from 'react';
import '../../../css/notFound.css';

interface Props {
	children: ReactNode;
}

/**
 * Catches a crash while rendering and shows a friendly page with a way out, instead of a blank screen.
 * It sits above the router, so it uses a plain link and a full reload to start from a clean state.
 */
export default class ErrorBoundary extends Component<Props, { failed: boolean }> {
	state = { failed: false };

	static getDerivedStateFromError() {
		return { failed: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error('Page crashed:', error, info.componentStack);
	}

	render() {
		if (!this.state.failed) return this.props.children;

		return (
			<div className="not-found">
				<Container>
					<Box className="not-found-content" role="alert">
						<Typography className="not-found-code" aria-hidden="true">
							Oops
						</Typography>
						<Typography variant="h1" className="not-found-title">
							Something went wrong
						</Typography>
						<Typography className="not-found-text">
							We hit an unexpected problem. Reload the page, or go back to the home page.
						</Typography>
						<Stack className="not-found-actions">
							<Button variant="contained" color="primary" onClick={() => window.location.reload()}>
								Reload page
							</Button>
							<Button variant="outlined" href="/">
								Back to home
							</Button>
						</Stack>
					</Box>
				</Container>
			</div>
		);
	}
}
