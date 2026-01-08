import React, { useState } from 'react';
import {
	Box,
	Container,
	Typography,
	Tab,
	Tabs,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	List,
	ListItem,
	ListItemText,
	Grid,
	Divider,
	Card,
	CardContent,
	Link,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import HelpIcon from '@mui/icons-material/Help';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Pinterest color palette
const pinterestColors = {
	red: '#e60023',
	lightRed: '#ffeaee',
	darkGray: '#333333',
	mediumGray: '#767676',
	lightGray: '#efefef',
	white: '#ffffff',
};

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`help-tabpanel-${index}`}
			aria-labelledby={`help-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `help-tab-${index}`,
		'aria-controls': `help-tabpanel-${index}`,
	};
}

export default function HelpPage() {
	const [value, setValue] = useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<div className={'help-page'} style={{ backgroundColor: pinterestColors.lightGray }}>
			<Box
				sx={{
					bgcolor: pinterestColors.red,
					color: pinterestColors.white,
					py: 6,
					mb: 4,
					position: 'relative',
				}}
			>
				<Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
					<Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
						Help Center
					</Typography>
					<Typography variant="h5">Serving customers across South Korea</Typography>
				</Box>
			</Box>

			<Container maxWidth="lg" sx={{ mb: 8 }}>
				<Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
					<Tabs
						value={value}
						onChange={handleChange}
						variant="fullWidth"
						aria-label="help page tabs"
						sx={{
							bgcolor: pinterestColors.white,
							boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
							'& .MuiTab-root': {
								textTransform: 'none',
								fontSize: '1rem',
								fontWeight: 500,
								color: pinterestColors.mediumGray,
							},
							'& .Mui-selected': {
								color: `${pinterestColors.red} !important`,
							},
							'& .MuiTabs-indicator': {
								backgroundColor: pinterestColors.red,
							},
						}}
					>
						<Tab icon={<HelpIcon />} label="FAQs" {...a11yProps(0)} />
						<Tab icon={<LocalShippingIcon />} label="Shipping" {...a11yProps(1)} />
						<Tab icon={<AssignmentReturnIcon />} label="Returns" {...a11yProps(2)} />
						<Tab icon={<ContactSupportIcon />} label="Contact" {...a11yProps(3)} />
					</Tabs>
				</Box>

				{/* FAQs Tab */}
				<TabPanel value={value} index={0}>
					<Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: pinterestColors.darkGray }}>
						Frequently Asked Questions
					</Typography>

					<Grid container spacing={3}>
						<Grid size={{ xs: 12 }}>
							<Accordion
								sx={{
									mb: 2,
									boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
									'&:before': { display: 'none' },
									borderRadius: '8px !important',
								}}
							>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon sx={{ color: pinterestColors.red }} />}
									sx={{ bgcolor: pinterestColors.white }}
								>
									<Typography variant="h6" sx={{ color: pinterestColors.darkGray }}>
										How do I find my size?
									</Typography>
								</AccordionSummary>
								<AccordionDetails sx={{ bgcolor: pinterestColors.white }}>
									<Typography sx={{ color: pinterestColors.mediumGray }}>
										We provide detailed size charts on each product page. Take your measurements and compare them to our
										size guide. If you're between sizes, we recommend sizing up for a more comfortable fit. Korean sizes
										may run smaller than Western sizes, so please check measurements carefully.
									</Typography>
								</AccordionDetails>
							</Accordion>

							<Accordion
								sx={{
									mb: 2,
									boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
									'&:before': { display: 'none' },
									borderRadius: '8px !important',
								}}
							>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon sx={{ color: pinterestColors.red }} />}
									sx={{ bgcolor: pinterestColors.white }}
								>
									<Typography variant="h6" sx={{ color: pinterestColors.darkGray }}>
										How can I track my order?
									</Typography>
								</AccordionSummary>
								<AccordionDetails sx={{ bgcolor: pinterestColors.white }}>
									<Typography sx={{ color: pinterestColors.mediumGray }}>
										Once your order is shipped, you'll receive a confirmation email with a tracking number. You can use
										this number on our website under "Order Tracking" or directly on the carrier's website. For orders
										within South Korea, we typically use CJ Logistics or Korea Post.
									</Typography>
								</AccordionDetails>
							</Accordion>

							<Accordion
								sx={{
									mb: 2,
									boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
									'&:before': { display: 'none' },
									borderRadius: '8px !important',
								}}
							>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon sx={{ color: pinterestColors.red }} />}
									sx={{ bgcolor: pinterestColors.white }}
								>
									<Typography variant="h6" sx={{ color: pinterestColors.darkGray }}>
										Where do you deliver in South Korea?
									</Typography>
								</AccordionSummary>
								<AccordionDetails sx={{ bgcolor: pinterestColors.white }}>
									<Typography sx={{ color: pinterestColors.mediumGray }}>
										We deliver to all addresses throughout South Korea, including Seoul, Busan, Incheon, Daegu, Daejeon,
										Gwangju, and Jeju Island. Remote areas might require additional delivery time.
									</Typography>
								</AccordionDetails>
							</Accordion>

							<Accordion
								sx={{
									boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
									'&:before': { display: 'none' },
									borderRadius: '8px !important',
								}}
							>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon sx={{ color: pinterestColors.red }} />}
									sx={{ bgcolor: pinterestColors.white }}
								>
									<Typography variant="h6" sx={{ color: pinterestColors.darkGray }}>
										How do I care for my clothes?
									</Typography>
								</AccordionSummary>
								<AccordionDetails sx={{ bgcolor: pinterestColors.white }}>
									<Typography sx={{ color: pinterestColors.mediumGray }}>
										Each garment comes with care instructions on the label. Generally, we recommend washing in cold
										water, using gentle cycle, and air drying when possible to extend the life of your clothes. For
										specific fabrics, please refer to the product's care label.
									</Typography>
								</AccordionDetails>
							</Accordion>
						</Grid>
					</Grid>
				</TabPanel>

				{/* Shipping Tab */}
				<TabPanel value={value} index={1}>
					<Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: pinterestColors.darkGray }}>
						Shipping Information
					</Typography>

					<Box
						sx={{
							p: 3,
							mb: 4,
							borderRadius: 2,
							bgcolor: pinterestColors.lightRed,
							border: '1px solid',
							borderColor: pinterestColors.red,
						}}
					>
						<Typography variant="h5" color={pinterestColors.red} fontWeight="bold">
							FREE SHIPPING on all orders over $100 (₩120,000)
						</Typography>
						<Typography variant="body1" sx={{ mt: 1, color: pinterestColors.darkGray }}>
							Enjoy complimentary standard shipping on all qualifying orders throughout South Korea!
						</Typography>
					</Box>

					<Grid container spacing={4}>
						<Grid size={{ xs: 12, md: 6 }}>
							<Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
								<CardContent sx={{ bgcolor: pinterestColors.white }}>
									<Typography variant="h6" gutterBottom fontWeight="bold" color={pinterestColors.darkGray}>
										Shipping Methods & Times
									</Typography>
									<List disablePadding>
										<ListItem>
											<ListItemText
												primary={
													<Typography color={pinterestColors.darkGray}>
														Standard Shipping (2-3 business days)
													</Typography>
												}
												secondary={
													<Typography color={pinterestColors.mediumGray}>
														Free for orders over $100, otherwise ₩3,000
													</Typography>
												}
											/>
										</ListItem>
										<Divider sx={{ borderColor: pinterestColors.lightGray }} />
										<ListItem>
											<ListItemText
												primary={
													<Typography color={pinterestColors.darkGray}>Express Shipping (1-2 business days)</Typography>
												}
												secondary={<Typography color={pinterestColors.mediumGray}>₩6,000</Typography>}
											/>
										</ListItem>
										<Divider sx={{ borderColor: pinterestColors.lightGray }} />
										<ListItem>
											<ListItemText
												primary={
													<Typography color={pinterestColors.darkGray}>
														Same-Day Delivery (Seoul metropolitan area only)
													</Typography>
												}
												secondary={
													<Typography color={pinterestColors.mediumGray}>
														₩10,000 (Order must be placed before 12 PM KST)
													</Typography>
												}
											/>
										</ListItem>
									</List>
								</CardContent>
							</Card>
						</Grid>

						<Grid size={{ xs: 12, md: 6 }}>
							<Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
								<CardContent sx={{ bgcolor: pinterestColors.white }}>
									<Typography variant="h6" gutterBottom fontWeight="bold" color={pinterestColors.darkGray}>
										Order Processing
									</Typography>
									<Typography paragraph color={pinterestColors.mediumGray}>
										Orders are typically processed within 1 business day. Once your order ships, you'll receive a
										confirmation email with tracking information from our delivery partners (CJ Logistics or Korea
										Post).
									</Typography>

									<Typography variant="h6" gutterBottom fontWeight="bold" color={pinterestColors.darkGray}>
										Delivery Information
									</Typography>
									<Typography color={pinterestColors.mediumGray}>
										For apartment deliveries, our couriers will attempt to deliver to your door. If you're not
										available, they will contact you to arrange redelivery or leave your package at a designated safe
										place.
									</Typography>
									<Typography sx={{ mt: 2 }} color={pinterestColors.mediumGray}>
										For remote areas such as Jeju Island and other islands, please allow 1-2 additional business days
										for delivery.
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</TabPanel>

				{/* Returns Tab */}
				<TabPanel value={value} index={2}>
					<Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: pinterestColors.darkGray }}>
						Returns & Exchanges
					</Typography>

					<Grid container spacing={3}>
						<Grid size={{ xs: 12 }}>
							<Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
								<CardContent sx={{ bgcolor: pinterestColors.white }}>
									<Typography variant="h6" gutterBottom fontWeight="bold" color={pinterestColors.darkGray}>
										Return Policy
									</Typography>
									<Typography paragraph color={pinterestColors.mediumGray}>
										We want you to be completely satisfied with your purchase. If you're not happy for any reason, you
										can return unworn items with original tags within 14 days of delivery for a full refund or store
										credit.
									</Typography>
								</CardContent>
							</Card>

							<Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
								<CardContent sx={{ bgcolor: pinterestColors.white }}>
									<Typography variant="h6" gutterBottom fontWeight="bold" color={pinterestColors.darkGray}>
										How to Return an Item
									</Typography>
									<List>
										<ListItem>
											<ListItemText
												primary={<Typography color={pinterestColors.darkGray}>Step 1: Contact Us</Typography>}
												secondary={
													<Typography color={pinterestColors.mediumGray}>
														Email azbeksid@gmail.com with your order number and return reason
													</Typography>
												}
											/>
										</ListItem>
										<Divider sx={{ borderColor: pinterestColors.lightGray }} />
										<ListItem>
											<ListItemText
												primary={<Typography color={pinterestColors.darkGray}>Step 2: Package Items</Typography>}
												secondary={
													<Typography color={pinterestColors.mediumGray}>
														Use original packaging if possible and include all tags
													</Typography>
												}
											/>
										</ListItem>
										<Divider sx={{ borderColor: pinterestColors.lightGray }} />
										<ListItem>
											<ListItemText
												primary={<Typography color={pinterestColors.darkGray}>Step 3: Ship Return</Typography>}
												secondary={
													<Typography color={pinterestColors.mediumGray}>
														Use the return label we provide or your preferred method
													</Typography>
												}
											/>
										</ListItem>
									</List>
								</CardContent>
							</Card>

							<Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
								<CardContent sx={{ bgcolor: pinterestColors.white }}>
									<Typography variant="h6" gutterBottom fontWeight="bold" color={pinterestColors.darkGray}>
										Exchanges & Non-Returnable Items
									</Typography>
									<Typography paragraph color={pinterestColors.mediumGray}>
										For exchanges, please indicate your preferred replacement size or color when contacting our customer
										service. We'll check availability and process your exchange as quickly as possible.
									</Typography>
									<Typography color={pinterestColors.mediumGray}>
										<strong>Non-Returnable Items:</strong> Sale items marked as "Final Sale," underwear, swimwear (if
										hygiene seal is removed), and personalized items cannot be returned unless defective.
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</TabPanel>

				{/* Contact Tab */}
				<TabPanel value={value} index={3}>
					<Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: pinterestColors.darkGray }}>
						Contact Us
					</Typography>

					<Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
						<CardContent sx={{ bgcolor: pinterestColors.white }}>
							<Typography variant="h6" gutterBottom fontWeight="bold" color={pinterestColors.darkGray}>
								Contact Information
							</Typography>
							<List>
								<ListItem>
									<EmailIcon sx={{ mr: 2, color: pinterestColors.red }} />
									<ListItemText
										primary={<Typography color={pinterestColors.darkGray}>Email</Typography>}
										secondary={
											<Link href="mailto:azbeksid@gmail.com" sx={{ color: pinterestColors.red }}>
												azbeksid@gmail.com
											</Link>
										}
									/>
								</ListItem>
								<Divider sx={{ borderColor: pinterestColors.lightGray }} />
								<ListItem>
									<InstagramIcon sx={{ mr: 2, color: pinterestColors.red }} />
									<ListItemText
										primary={<Typography color={pinterestColors.darkGray}>Instagram</Typography>}
										secondary={
											<Link
												href="https://instagram.com/siddikov_aziz"
												target="_blank"
												rel="noopener"
												sx={{ color: pinterestColors.red }}
											>
												@siddikov_aziz
											</Link>
										}
									/>
								</ListItem>
								<Divider sx={{ borderColor: pinterestColors.lightGray }} />
								<ListItem>
									<PhoneIcon sx={{ mr: 2, color: pinterestColors.red }} />
									<ListItemText
										primary={<Typography color={pinterestColors.darkGray}>Customer Service</Typography>}
										secondary={
											<Typography color={pinterestColors.mediumGray}>
												02-123-4567 (Monday-Friday, 9am-6pm KST)
											</Typography>
										}
									/>
								</ListItem>
								<Divider sx={{ borderColor: pinterestColors.lightGray }} />
								<ListItem>
									<LocationOnIcon sx={{ mr: 2, color: pinterestColors.red }} />
									<ListItemText
										primary={<Typography color={pinterestColors.darkGray}>Store Location</Typography>}
										secondary={
											<Typography color={pinterestColors.mediumGray}>
												123 Fashion Street, Gangnam-gu, Seoul, South Korea 06123
											</Typography>
										}
									/>
								</ListItem>
							</List>
							<Typography variant="body2" color={pinterestColors.mediumGray} sx={{ mt: 2 }}>
								Opening Hours: 10:30 AM - 8:30 PM (Closed on Mondays)
							</Typography>
						</CardContent>
					</Card>
				</TabPanel>
			</Container>
		</div>
	);
}
