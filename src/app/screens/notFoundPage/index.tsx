import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import '../../../css/notFound.css';

/** Shown for any address the storefront does not know, and for a product that does not exist. */
export default function NotFoundPage({
	title = 'Page not found',
	message = 'The page you are looking for does not exist or has moved.',
}: {
	title?: string;
	message?: string;
}) {
	return (
		<div className="not-found">
			<Container>
				<Box className="not-found-content">
					<Typography className="not-found-code" aria-hidden="true">
						404
					</Typography>
					<Typography variant="h1" className="not-found-title">
						{title}
					</Typography>
					<Typography className="not-found-text">{message}</Typography>
					<Stack className="not-found-actions">
						<Button component={Link} to="/" variant="contained" color="primary">
							Back to home
						</Button>
						<Button component={Link} to="/products" variant="outlined">
							Browse products
						</Button>
					</Stack>
				</Box>
			</Container>
		</div>
	);
}
