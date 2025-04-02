import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import SecurityIcon from '@mui/icons-material/Security';
import '../../../css/homePage/advertisement.css';

export default function Advertisement() {
	return (
		<Box className="advertisement-section">
			<Container>
				<Typography variant="h2" className="section-title">
					Why Shop With Us
				</Typography>

				<Grid container spacing={4} className="features-container">
					{/* Free Shipping */}
					<Grid item xs={12} md={4}>
						<Box className="feature-card">
							<Box className="feature-icon">
								<LocalShippingIcon />
							</Box>
							<Typography variant="h3" className="feature-title">
								Free Shipping
							</Typography>
							<Typography variant="body1" className="feature-description">
								Free shipping on all orders over $50. We deliver to your doorstep with care.
							</Typography>
						</Box>
					</Grid>

					{/* Easy Returns */}
					<Grid item xs={12} md={4}>
						<Box className="feature-card">
							<Box className="feature-icon">
								<AssignmentReturnIcon />
							</Box>
							<Typography variant="h3" className="feature-title">
								Easy Returns
							</Typography>
							<Typography variant="body1" className="feature-description">
								30-day return policy. Not satisfied? Return it for free, no questions asked.
							</Typography>
						</Box>
					</Grid>

					{/* Secure Payments */}
					<Grid item xs={12} md={4}>
						<Box className="feature-card">
							<Box className="feature-icon">
								<SecurityIcon />
							</Box>
							<Typography variant="h3" className="feature-title">
								Secure Payments
							</Typography>
							<Typography variant="body1" className="feature-description">
								Your payment information is processed securely. We never store your details.
							</Typography>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
