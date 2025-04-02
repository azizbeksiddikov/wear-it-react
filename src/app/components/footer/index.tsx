import React from 'react';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import '../../../css/footer.css';

export default function Footer() {
	return (
		<footer className="footer">
			<Container>
				<Box className="footer-content">
					<Grid container spacing={4}>
						{/* Brand column */}
						<Grid item xs={12} sm={6} md={6}>
							<Box className="brand-section">
								<Typography variant="h5" className="brand-name">
									<Link to="/">Wear It</Link>
								</Typography>
								<Typography variant="body2" className="brand-description">
									Discover and shop the latest fashion trends.
								</Typography>
								<Box className="social-links">
									<a
										href="https://github.com/azizbeksiddikov"
										target="_blank"
										rel="noopener noreferrer"
										aria-label="GitHub"
									>
										<GitHubIcon />
									</a>
									<a
										href="https://www.linkedin.com/in/azbek/"
										target="_blank"
										rel="noopener noreferrer"
										aria-label="LinkedIn"
									>
										<LinkedInIcon />
									</a>
									<a
										href="https://www.instagram.com/siddikov_aziz/"
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Instagram"
									>
										<InstagramIcon />
									</a>
								</Box>
							</Box>
						</Grid>

						{/* Shop column */}
						<Grid item xs={12} sm={6} md={6}>
							<Box className="links-section">
								<Typography variant="subtitle1" className="section-title">
									Shop
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<ul>
											<li>
												<Link to="/products?gender=women">Women</Link>
											</li>
											<li>
												<Link to="/products?gender=men">Men</Link>
											</li>
											<li>
												<Link to="/products?category=accessories">Accessories</Link>
											</li>
										</ul>
									</Grid>
									<Grid item xs={6}>
										<ul>
											<li>
												<Link to="/products?category=shoes">Shoes</Link>
											</li>
											<li>
												<Link to="/products?category=tops">Tops</Link>
											</li>
											<li>
												<Link to="/products?category=bottoms">Bottoms</Link>
											</li>
										</ul>
									</Grid>
								</Grid>
							</Box>
						</Grid>
					</Grid>
				</Box>

				{/* Copyright section */}
				<Box className="copyright-section">
					<Stack className="copyright-content">
						<Typography variant="body2" className="copyright-text">
							© {new Date().getFullYear()} Wear It. All rights reserved.
						</Typography>
						<Stack className="legal-links">
							<Typography variant="body2">Privacy Policy</Typography>
							<Typography variant="body2">Terms of Service</Typography>
						</Stack>
					</Stack>
				</Box>
			</Container>
		</footer>
	);
}
