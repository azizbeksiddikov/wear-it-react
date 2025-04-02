import React from 'react';
import { Container, Stack, Box, Typography, Card, CardContent, CardActions, Grid, Divider } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import { useState, SyntheticEvent } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import '../../../css/orders.css';
import TabPanel from '@mui/lab/TabPanel';
import Button from '@mui/material/Button';
import moment from 'moment';

// Order type definition
interface Order {
	id: string;
	product: string;
	quantity: number;
	price: number;
	orderDate: string;
	address: string;
	status: 'paused' | 'process' | 'finished';
}

export default function OrdersPage() {
	// State for current tab
	const [value, setValue] = useState<string>('paused');

	// State for orders in different stages
	const [pausedOrders, setPausedOrders] = useState<Order[]>([
		{
			id: 'ord-001',
			product: 'Blue T-Shirt',
			quantity: 2,
			price: 29.99,
			orderDate: '2023-07-15',
			address: '123 Main St, City',
			status: 'paused',
		},
		{
			id: 'ord-002',
			product: 'Black Jeans',
			quantity: 1,
			price: 49.99,
			orderDate: '2023-07-16',
			address: '456 Oak Ave, Town',
			status: 'paused',
		},
	]);

	const [processOrders, setProcessOrders] = useState<Order[]>([
		{
			id: 'ord-003',
			product: 'White Sneakers',
			quantity: 1,
			price: 79.99,
			orderDate: '2023-07-10',
			address: '789 Pine Rd, Village',
			status: 'process',
		},
	]);

	const [finishedOrders, setFinishedOrders] = useState<Order[]>([
		{
			id: 'ord-004',
			product: 'Baseball Cap',
			quantity: 3,
			price: 19.99,
			orderDate: '2023-07-05',
			address: '321 Elm Blvd, City',
			status: 'finished',
		},
	]);

	// Handle tab change
	const handleChange = (event: SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	// Move order from Paused to Process
	const moveToProcess = (orderId: string) => {
		const orderToMove = pausedOrders.find((order) => order.id === orderId);
		if (orderToMove) {
			const updatedOrder = { ...orderToMove, status: 'process' as const };
			setPausedOrders(pausedOrders.filter((order) => order.id !== orderId));
			setProcessOrders([...processOrders, updatedOrder]);
		}
	};

	// Move order from Process to Finished
	const moveToFinished = (orderId: string) => {
		const orderToMove = processOrders.find((order) => order.id === orderId);
		if (orderToMove) {
			const updatedOrder = { ...orderToMove, status: 'finished' as const };
			setProcessOrders(processOrders.filter((order) => order.id !== orderId));
			setFinishedOrders([...finishedOrders, updatedOrder]);
		}
	};

	// Order Card Component
	const OrderCard = ({ order, actionButton }: { order: Order; actionButton?: JSX.Element }) => (
		<Card className="order-card" variant="outlined" sx={{ mb: 2 }}>
			<Box className="card-header">
				<Typography variant="h6">{order.product}</Typography>
				<Typography variant="body2" className="order-id">
					Order ID: {order.id}
				</Typography>
			</Box>
			<CardContent className="card-content">
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
					<span className={`status-indicator status-${order.status}`}></span>
					<Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
						{order.status}
					</Typography>
				</Box>

				<Typography variant="body2" className="order-date">
					Ordered on {moment(order.orderDate).format('MMMM D, YYYY')}
				</Typography>

				<Divider sx={{ my: 1.5 }} />

				<Typography variant="body1">
					Quantity: {order.quantity} × ${order.price.toFixed(2)}
				</Typography>

				<Typography variant="h6" color="primary" className="order-total">
					Total: ${(order.quantity * order.price).toFixed(2)}
				</Typography>

				<Box className="order-address">
					<LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
					<Typography variant="body2">{order.address}</Typography>
				</Box>
			</CardContent>
			{actionButton && <CardActions className="card-actions">{actionButton}</CardActions>}
		</Card>
	);

	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Typography variant="h4" component="h1" className="orders-title">
				My Orders
			</Typography>

			<TabContext value={value}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs
						value={value}
						onChange={handleChange}
						aria-label="order tabs"
						className="order-tabs"
						variant="fullWidth"
					>
						<Tab label={`Paused (${pausedOrders.length})`} value="paused" />
						<Tab label={`Processing (${processOrders.length})`} value="process" />
						<Tab label={`Completed (${finishedOrders.length})`} value="finished" />
					</Tabs>
				</Box>

				<TabPanel value="paused">
					<Grid container spacing={2}>
						{pausedOrders.length === 0 ? (
							<Box className="empty-orders" sx={{ width: '100%' }}>
								<Typography variant="body1">You don't have any paused orders.</Typography>
							</Box>
						) : (
							pausedOrders.map((order) => (
								<Grid item xs={12} md={6} lg={4} key={order.id}>
									<OrderCard
										order={order}
										actionButton={
											<Button
												variant="contained"
												color="primary"
												onClick={() => moveToProcess(order.id)}
												className="action-btn process-btn"
											>
												Move to Processing
											</Button>
										}
									/>
								</Grid>
							))
						)}
					</Grid>
				</TabPanel>

				<TabPanel value="process">
					<Grid container spacing={2}>
						{processOrders.length === 0 ? (
							<Box className="empty-orders" sx={{ width: '100%' }}>
								<Typography variant="body1">No orders are currently being processed.</Typography>
							</Box>
						) : (
							processOrders.map((order) => (
								<Grid item xs={12} md={6} lg={4} key={order.id}>
									<OrderCard
										order={order}
										actionButton={
											<Button
												variant="contained"
												color="success"
												onClick={() => moveToFinished(order.id)}
												className="action-btn finish-btn"
											>
												Mark as Completed
											</Button>
										}
									/>
								</Grid>
							))
						)}
					</Grid>
				</TabPanel>

				<TabPanel value="finished">
					<Grid container spacing={2}>
						{finishedOrders.length === 0 ? (
							<Box className="empty-orders" sx={{ width: '100%' }}>
								<Typography variant="body1">You haven't completed any orders yet.</Typography>
							</Box>
						) : (
							finishedOrders.map((order) => (
								<Grid item xs={12} md={6} lg={4} key={order.id}>
									<OrderCard
										order={order}
										actionButton={
											<Button variant="outlined" color="secondary" disabled className="action-btn">
												Order Completed
											</Button>
										}
									/>
								</Grid>
							))
						)}
					</Grid>
				</TabPanel>
			</TabContext>
		</Container>
	);
}
