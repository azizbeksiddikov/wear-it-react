import React from 'react';
import {
	Container,
	Stack,
	Box,
	Typography,
	Card,
	CardContent,
	CardActions,
	Grid,
	Divider,
	List,
	ListItem,
} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import { useState, SyntheticEvent, useEffect } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import '../../../css/orders.css';
import TabPanel from '@mui/lab/TabPanel';
import Button from '@mui/material/Button';
import moment from 'moment';
import { Order, OrderItem } from '../../../libs/types/order';
import { OrderStatus } from '../../../libs/enums/order.enum';

// Extended Order type for UI with items
interface ExtendedOrder extends Order {
	items: OrderItem[];
	productName?: string; // For backward compatibility
}

export default function OrdersPage() {
	// State for current tab (using OrderStatus enum)
	const [value, setValue] = useState<string>(OrderStatus.PAUSED);

	// State for orders in different stages
	const [pausedOrders, setPausedOrders] = useState<ExtendedOrder[]>([
		{
			_id: 'ord-001',
			memberId: 'mem-001',
			orderDate: new Date('2023-07-15'),
			orderStatus: OrderStatus.PAUSED,
			orderShippingAddress: '123 Main St, City',
			orderSubTotal: 69.97,
			orderShippingCost: 5.99,
			orderTotalAmount: 75.96,
			createdAt: new Date('2023-07-15'),
			updatedAt: new Date('2023-07-15'),
			items: [
				{
					_id: 'item-001',
					orderId: 'ord-001',
					productId: 'prod-001',
					variantId: 'var-001',
					itemQuantity: 2,
					itemUnitPrice: 29.99,
					size: 'M',
					color: 'Blue',
					createdAt: new Date('2023-07-15'),
					updatedAt: new Date('2023-07-15'),
				},
				{
					_id: 'item-002',
					orderId: 'ord-001',
					productId: 'prod-002',
					variantId: 'var-002',
					itemQuantity: 1,
					itemUnitPrice: 9.99,
					size: 'One Size',
					color: 'White',
					createdAt: new Date('2023-07-15'),
					updatedAt: new Date('2023-07-15'),
				},
			],
		},
	]);

	const [processOrders, setProcessOrders] = useState<ExtendedOrder[]>([
		{
			_id: 'ord-002',
			memberId: 'mem-001',
			orderDate: new Date('2023-07-10'),
			orderStatus: OrderStatus.PROCESSING,
			orderShippingAddress: '789 Pine Rd, Village',
			orderSubTotal: 92.98,
			orderShippingCost: 5.99,
			orderTotalAmount: 98.97,
			createdAt: new Date('2023-07-10'),
			updatedAt: new Date('2023-07-11'),
			items: [
				{
					_id: 'item-003',
					orderId: 'ord-002',
					productId: 'prod-003',
					variantId: 'var-003',
					itemQuantity: 1,
					itemUnitPrice: 79.99,
					size: '9',
					color: 'White',
					createdAt: new Date('2023-07-10'),
					updatedAt: new Date('2023-07-10'),
				},
				{
					_id: 'item-004',
					orderId: 'ord-002',
					productId: 'prod-004',
					variantId: 'var-004',
					itemQuantity: 1,
					itemUnitPrice: 12.99,
					size: 'One Size',
					color: 'Black',
					createdAt: new Date('2023-07-10'),
					updatedAt: new Date('2023-07-10'),
				},
			],
		},
	]);

	const [finishedOrders, setFinishedOrders] = useState<ExtendedOrder[]>([
		{
			_id: 'ord-003',
			memberId: 'mem-001',
			orderDate: new Date('2023-07-05'),
			orderStatus: OrderStatus.FINISHED,
			orderShippingAddress: '321 Elm Blvd, City',
			orderSubTotal: 54.98,
			orderShippingCost: 5.99,
			orderTotalAmount: 60.97,
			createdAt: new Date('2023-07-05'),
			updatedAt: new Date('2023-07-07'),
			items: [
				{
					_id: 'item-005',
					orderId: 'ord-003',
					productId: 'prod-005',
					variantId: 'var-005',
					itemQuantity: 1,
					itemUnitPrice: 19.99,
					size: 'One Size',
					color: 'Navy',
					createdAt: new Date('2023-07-05'),
					updatedAt: new Date('2023-07-05'),
				},
				{
					_id: 'item-006',
					orderId: 'ord-003',
					productId: 'prod-006',
					variantId: 'var-006',
					itemQuantity: 1,
					itemUnitPrice: 34.99,
					size: 'One Size',
					color: 'Black',
					createdAt: new Date('2023-07-05'),
					updatedAt: new Date('2023-07-05'),
				},
			],
		},
	]);

	// Product names mapping (in a real app, would be fetched from API)
	const [productNames, setProductNames] = useState<Record<string, string>>({
		'prod-001': 'Blue T-Shirt',
		'prod-002': 'White Socks',
		'prod-003': 'White Sneakers',
		'prod-004': 'Sport Socks',
		'prod-005': 'Baseball Cap',
		'prod-006': 'Sunglasses',
	});

	// Handle tab change
	const handleChange = (event: SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	// Move order from Paused to Process
	const moveToProcess = (orderId: string) => {
		const orderToMove = pausedOrders.find((order) => order._id === orderId);
		if (orderToMove) {
			const updatedOrder = {
				...orderToMove,
				orderStatus: OrderStatus.PROCESSING,
				updatedAt: new Date(),
			};
			setPausedOrders(pausedOrders.filter((order) => order._id !== orderId));
			setProcessOrders([...processOrders, updatedOrder]);
		}
	};

	// Move order from Process to Finished
	const moveToFinished = (orderId: string) => {
		const orderToMove = processOrders.find((order) => order._id === orderId);
		if (orderToMove) {
			const updatedOrder = {
				...orderToMove,
				orderStatus: OrderStatus.FINISHED,
				updatedAt: new Date(),
			};
			setProcessOrders(processOrders.filter((order) => order._id !== orderId));
			setFinishedOrders([...finishedOrders, updatedOrder]);
		}
	};

	// Helper function to get product name
	const getProductName = (productId: string): string => {
		return productNames[productId] || 'Unknown Product';
	};

	// Order Card Component
	const OrderCard = ({ order, actionButton }: { order: ExtendedOrder; actionButton?: JSX.Element }) => (
		<Card className="order-card" variant="outlined" sx={{ mb: 2 }}>
			<Box className="card-header">
				<Typography variant="h6">Order #{order._id}</Typography>
				<Typography variant="body2" className="order-date">
					Ordered on {moment(order.orderDate).format('MMMM D, YYYY')}
				</Typography>
			</Box>
			<CardContent className="card-content">
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
					<span
						className={`status-indicator status-${order.orderStatus ? order.orderStatus.toLowerCase() : 'unknown'}`}
					></span>
					<Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
						{order.orderStatus || 'Unknown Status'}
					</Typography>
				</Box>

				<Divider sx={{ my: 1.5 }} />

				<Typography variant="subtitle1" className="items-heading">
					Order Items
				</Typography>

				<List className="order-items-list">
					{order.items.map((item) => (
						<ListItem key={item._id} className="order-item">
							<Box className="item-details">
								<Typography variant="body1" className="item-name">
									{getProductName(item.productId)}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Size: {item.size}, Color: {item.color}
								</Typography>
								<Typography variant="body2" className="item-price">
									${item.itemUnitPrice.toFixed(2)} × {item.itemQuantity}
								</Typography>
								<Typography variant="body2" className="item-subtotal">
									Subtotal: ${(item.itemUnitPrice * item.itemQuantity).toFixed(2)}
								</Typography>
							</Box>
						</ListItem>
					))}
				</List>

				<Divider sx={{ my: 1.5 }} />

				<Box className="order-summary">
					<Typography variant="body2">Subtotal: ${order.orderSubTotal.toFixed(2)}</Typography>
					<Typography variant="body2">Shipping: ${order.orderShippingCost.toFixed(2)}</Typography>
					<Typography variant="h6" color="primary" className="order-total">
						Total: ${order.orderTotalAmount.toFixed(2)}
					</Typography>
				</Box>

				<Box className="order-address">
					<LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
					<Typography variant="body2">{order.orderShippingAddress}</Typography>
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
						<Tab label={`Paused (${pausedOrders.length})`} value={OrderStatus.PAUSED} />
						<Tab label={`Processing (${processOrders.length})`} value={OrderStatus.PROCESSING} />
						<Tab label={`Completed (${finishedOrders.length})`} value={OrderStatus.FINISHED} />
					</Tabs>
				</Box>

				<TabPanel value={OrderStatus.PAUSED}>
					<Grid container spacing={2}>
						{pausedOrders.length === 0 ? (
							<Box className="empty-orders" sx={{ width: '100%' }}>
								<Typography variant="body1">You don't have any paused orders.</Typography>
							</Box>
						) : (
							pausedOrders.map((order) => (
								<Grid item xs={12} md={6} key={order._id}>
									<OrderCard
										order={order}
										actionButton={
											<Button
												variant="contained"
												color="primary"
												onClick={() => moveToProcess(order._id)}
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

				<TabPanel value={OrderStatus.PROCESSING}>
					<Grid container spacing={2}>
						{processOrders.length === 0 ? (
							<Box className="empty-orders" sx={{ width: '100%' }}>
								<Typography variant="body1">No orders are currently being processed.</Typography>
							</Box>
						) : (
							processOrders.map((order) => (
								<Grid item xs={12} md={6} key={order._id}>
									<OrderCard
										order={order}
										actionButton={
											<Button
												variant="contained"
												color="success"
												onClick={() => moveToFinished(order._id)}
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

				<TabPanel value={OrderStatus.FINISHED}>
					<Grid container spacing={2}>
						{finishedOrders.length === 0 ? (
							<Box className="empty-orders" sx={{ width: '100%' }}>
								<Typography variant="body1">You haven't completed any orders yet.</Typography>
							</Box>
						) : (
							finishedOrders.map((order) => (
								<Grid item xs={12} md={6} key={order._id}>
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
