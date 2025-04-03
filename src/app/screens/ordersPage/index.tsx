import React from 'react';
import { Container, Typography, Stack } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import { useState, SyntheticEvent } from 'react';
import TabPanel from '@mui/lab/TabPanel';
import { Order } from '../../../libs/types/order';
import { OrderStatus } from '../../../libs/enums/order.enum';
import PausedOrders from './PausedOrders';
import ProcessOrders from './ProcessOrders';
import FinishedOrders from './FinishedOrders';
import '../../../css/orders.css';
import { ProductCategory, ProductGender } from '../../../libs/enums/product.enum';
import AllOrders from './AllOrders';

export default function OrdersPage() {
	// State for current tab (using OrderStatus enum)
	const [value, setValue] = useState<string>(OrderStatus.PAUSED);

	// State for orders in different stages
	const [pausedOrders, setPausedOrders] = useState<Order[]>([
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
					productName: 'Blue T-Shirt',
					itemQuantity: 2,
					itemUnitPrice: 29.99,
					productCategory: ProductCategory.TOPS,
					productGender: ProductGender.MEN,
					productImage: '/img/t-shirt.jpg',
					size: 'M',
					color: 'BLUE',
					createdAt: new Date('2023-07-15'),
					updatedAt: new Date('2023-07-15'),
				},
				{
					_id: 'item-002',
					orderId: 'ord-001',
					productId: 'prod-002',
					variantId: 'var-002',
					productName: 'White Hoodie',
					itemQuantity: 1,
					itemUnitPrice: 9.99,
					productCategory: ProductCategory.SWEATERS,
					productGender: ProductGender.UNISEX,
					productImage: '/img/t-shirt.jpg',
					size: 'XL',
					color: 'WHITE',
					createdAt: new Date('2023-07-15'),
					updatedAt: new Date('2023-07-15'),
				},
			],
		},
		{
			_id: 'ord-002',
			memberId: 'mem-002',
			orderDate: new Date('2023-08-20'),
			orderStatus: OrderStatus.PAUSED,
			orderShippingAddress: '456 Elm St, Townsville',
			orderSubTotal: 120.45,
			orderShippingCost: 10.0,
			orderTotalAmount: 130.45,
			createdAt: new Date('2023-08-20'),
			updatedAt: new Date('2023-08-20'),
			items: [
				{
					_id: 'item-003',
					orderId: 'ord-002',
					productId: 'prod-003',
					variantId: 'var-003',
					productName: 'Red Jacket',
					itemQuantity: 1,
					itemUnitPrice: 50.0,
					productCategory: ProductCategory.JACKETS,
					productGender: ProductGender.MEN,
					productImage: '/img/t-shirt.jpg',
					size: 'L',
					color: 'RED',
					createdAt: new Date('2023-08-20'),
					updatedAt: new Date('2023-08-20'),
				},
				{
					_id: 'item-004',
					orderId: 'ord-002',
					productId: 'prod-004',
					variantId: 'var-004',
					productName: 'Black Jeans',
					itemQuantity: 2,
					itemUnitPrice: 35.22,
					productCategory: ProductCategory.JEANS,
					productGender: ProductGender.WOMEN,
					productImage: '/img/t-shirt.jpg',
					size: 'M',
					color: 'BLACK',
					createdAt: new Date('2023-08-20'),
					updatedAt: new Date('2023-08-20'),
				},
			],
		},
	]);

	const [processOrders, setProcessOrders] = useState<Order[]>([
		{
			_id: 'ord-003',
			memberId: 'mem-003',
			orderDate: new Date('2023-09-10'),
			orderStatus: OrderStatus.PROCESSING,
			orderShippingAddress: '789 Oak St, Villagetown',
			orderSubTotal: 89.99,
			orderShippingCost: 7.5,
			orderTotalAmount: 97.49,
			createdAt: new Date('2023-09-10'),
			updatedAt: new Date('2023-09-10'),
			items: [
				{
					_id: 'item-005',
					orderId: 'ord-003',
					productId: 'prod-005',
					variantId: 'var-005',
					productName: 'Green Polo Shirt',
					itemQuantity: 3,
					itemUnitPrice: 29.99,
					productCategory: ProductCategory.TOPS,
					productGender: ProductGender.MEN,
					productImage: '/img/t-shirt.jpg',
					size: 'S',
					color: 'GREEN',
					createdAt: new Date('2023-09-10'),
					updatedAt: new Date('2023-09-10'),
				},
			],
		},
		{
			_id: 'ord-004',
			memberId: 'mem-004',
			orderDate: new Date('2023-09-15'),
			orderStatus: OrderStatus.PROCESSING,
			orderShippingAddress: '321 Pine St, Hamlet',
			orderSubTotal: 150.0,
			orderShippingCost: 12.0,
			orderTotalAmount: 162.0,
			createdAt: new Date('2023-09-15'),
			updatedAt: new Date('2023-09-15'),
			items: [
				{
					_id: 'item-006',
					orderId: 'ord-004',
					productId: 'prod-006',
					variantId: 'var-006',
					productName: 'Black Leather Jacket',
					itemQuantity: 1,
					itemUnitPrice: 150.0,
					productCategory: ProductCategory.JACKETS,
					productGender: ProductGender.UNISEX,
					productImage: '/img/t-shirt.jpg',
					size: 'XL',
					color: 'BLACK',
					createdAt: new Date('2023-09-15'),
					updatedAt: new Date('2023-09-15'),
				},
			],
		},
	]);

	const [finishedOrders, setFinishedOrders] = useState<Order[]>([
		{
			_id: 'ord-005',
			memberId: 'mem-005',
			orderDate: new Date('2023-06-01'),
			orderStatus: OrderStatus.FINISHED,
			orderShippingAddress: '654 Maple St, Metropolis',
			orderSubTotal: 200.0,
			orderShippingCost: 15.0,
			orderTotalAmount: 215.0,
			createdAt: new Date('2023-06-01'),
			updatedAt: new Date('2023-06-05'),
			items: [
				{
					_id: 'item-007',
					orderId: 'ord-005',
					productId: 'prod-007',
					variantId: 'var-007',
					productName: 'Formal Suit',
					itemQuantity: 2,
					itemUnitPrice: 100.0,
					productCategory: ProductCategory.FORMALWEAR,
					productGender: ProductGender.MEN,
					productImage: '/img/t-shirt.jpg',
					size: 'M',
					color: 'NAVY',
					createdAt: new Date('2023-06-01'),
					updatedAt: new Date('2023-06-05'),
				},
			],
		},
		{
			_id: 'ord-006',
			memberId: 'mem-006',
			orderDate: new Date('2023-05-20'),
			orderStatus: OrderStatus.FINISHED,
			orderShippingAddress: '987 Birch St, Cityville',
			orderSubTotal: 75.0,
			orderShippingCost: 5.0,
			orderTotalAmount: 80.0,
			createdAt: new Date('2023-05-20'),
			updatedAt: new Date('2023-05-22'),
			items: [
				{
					_id: 'item-008',
					orderId: 'ord-006',
					productId: 'prod-008',
					variantId: 'var-008',
					productName: 'Blue Denim Jeans',
					itemQuantity: 1,
					itemUnitPrice: 75.0,
					productCategory: ProductCategory.JEANS,
					productGender: ProductGender.WOMEN,
					productImage: '/img/t-shirt.jpg',
					size: 'L',
					color: 'BLUE',
					createdAt: new Date('2023-05-20'),
					updatedAt: new Date('2023-05-22'),
				},
			],
		},
	]);

	const allOrders = [...pausedOrders, ...processOrders, ...finishedOrders];

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

			// Switch to the Processing tab
			setValue(OrderStatus.PROCESSING);
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

			// Switch to the Finished tab
			setValue(OrderStatus.FINISHED);
		}
	};

	return (
		<div className="orders">
			<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
				<Typography variant="h4" component="h1" className="orders-title">
					My Orders
				</Typography>

				<TabContext value={value}>
					{/* Navbar */}
					<Stack sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Tabs
							value={value}
							onChange={handleChange}
							aria-label="order tabs"
							className="order-tabs"
							variant="fullWidth"
							sx={{ '& .MuiTabs-indicator': { backgroundColor: '#e60023' } }}
						>
							<Tab label={`All (${pausedOrders.length})`} value={'ALL'} />
							<Tab label={`Paused (${pausedOrders.length})`} value={OrderStatus.PAUSED} />
							<Tab label={`Processing (${processOrders.length})`} value={OrderStatus.PROCESSING} />
							<Tab label={`Completed (${finishedOrders.length})`} value={OrderStatus.FINISHED} />
						</Tabs>
					</Stack>

					{/* ALL */}
					<TabPanel value={'ALL'} className="order-tab-panel">
						<AllOrders orders={allOrders} moveToProcess={moveToProcess} moveToFinished={moveToFinished} />
					</TabPanel>

					{/* PAUSED */}
					<TabPanel value={OrderStatus.PAUSED} className="order-tab-panel">
						<PausedOrders orders={pausedOrders} moveToProcess={moveToProcess} />
					</TabPanel>

					{/* PROCESSING */}
					<TabPanel value={OrderStatus.PROCESSING} className="order-tab-panel">
						<ProcessOrders orders={processOrders} moveToFinished={moveToFinished} />
					</TabPanel>

					{/* FINISHED */}
					<TabPanel value={OrderStatus.FINISHED} className="order-tab-panel">
						<FinishedOrders orders={finishedOrders} />
					</TabPanel>
				</TabContext>
			</Container>
		</div>
	);
}
