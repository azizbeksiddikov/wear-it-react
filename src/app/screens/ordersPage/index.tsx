import React, { useEffect } from 'react';
import { Container, Typography, Stack } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import { useState, SyntheticEvent } from 'react';
import TabPanel from '@mui/lab/TabPanel';
import { Order, OrderInquiry, OrderUpdateInput } from '../../../libs/types/order';
import { OrderStatus } from '../../../libs/enums/order.enum';
import PausedOrders from './PausedOrders';
import ProcessOrders from './ProcessOrders';
import FinishedOrders from './FinishedOrders';
import AllOrders from './AllOrders';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { setPausedOrders, setProcessOrders, setFinishedOrders, setAllOrders } from './slice';
import OrderService from '../../services/OrderService';
import { useGlobals } from '../../hooks/useGlobals';
import { useHistory } from 'react-router-dom';
import { T } from '../../../libs/types/common';
import { Messages } from '../../../libs/config';
import { sweetErrorHandling } from '../../../libs/sweetAlert';
import '../../../css/orders.css';

/** redux slice & selector */
const actionDispatch = (dispatch: Dispatch) => ({
	setAllOrders: (data: Order[]) => dispatch(setAllOrders(data)),
	setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
	setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
	setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

export default function OrdersPage() {
	const history = useHistory();
	const { authMember, orderBuilder, setOrderBuilder } = useGlobals();
	if (!authMember) history.push('/');

	const { setAllOrders, setPausedOrders, setProcessOrders, setFinishedOrders } = actionDispatch(useDispatch());

	const [value, setValue] = useState<string>(OrderStatus.PAUSED);
	const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
		page: 1,
		limit: 10,
		orderStatus: OrderStatus.PAUSED,
	});
	const orderService = new OrderService();

	useEffect(() => {
		// Helper function to fetch orders with specific status
		const fetchOrders = (status?: OrderStatus) => {
			const queryParams = {
				...orderInquiry,
				page: 1,
				limit: 10,
			};

			// If we want all orders, remove the orderStatus property
			if (!status) {
				delete queryParams.orderStatus;
			} else {
				queryParams.orderStatus = status;
			}

			return orderService.getMyOrders(queryParams);
		};

		// Fetch all order types in parallel
		Promise.all([
			fetchOrders(), // All orders
			fetchOrders(OrderStatus.PAUSED), // Paused orders
			fetchOrders(OrderStatus.PROCESSING), // Processing orders
			fetchOrders(OrderStatus.FINISHED), // Finished orders
		])
			.then(([all, paused, processing, finished]) => {
				setAllOrders(all);
				setPausedOrders(paused);
				setProcessOrders(processing);
				setFinishedOrders(finished);
				console.log('all orders', all);
			})
			.catch((err) => console.log('Error fetching orders:', err));
	}, [orderInquiry, orderBuilder]);

	/** HANDLERS */

	const handleChange = (event: SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	const deleteOrderHandler = async (e: T) => {
		try {
			if (!authMember) throw Error(Messages.error2);

			const orderId = e.target.value;
			const input: OrderUpdateInput = {
				_id: orderId,
				orderStatus: OrderStatus.DELETED,
			};

			const confirmation = window.confirm('Do you want to delete this order?');
			if (confirmation) {
				await orderService.updateOrder(input);
				setOrderBuilder(new Date()); // refresh order page
			}
		} catch (err) {
			console.log(err);
			sweetErrorHandling(err).then();
		}
	};

	const processOrderHandler = async (e: T) => {
		try {
			if (!authMember) throw Error(Messages.error2);

			const orderId = e.target.value;
			const input: OrderUpdateInput = {
				_id: orderId,
				orderStatus: OrderStatus.PROCESSING,
			};

			const confirmation = window.confirm('Do you want to proceed with payment?');
			if (confirmation) {
				await orderService.updateOrder(input);
				setValue(OrderStatus.PROCESSING);
				setOrderBuilder(new Date());
			}
		} catch (err) {
			console.log(err);
			sweetErrorHandling(err).then();
		}
	};

	const finishOrderHandler = async (e: T) => {
		try {
			if (!authMember) throw Error(Messages.error2);

			const orderId = e.target.value;
			const input: OrderUpdateInput = {
				_id: orderId,
				orderStatus: OrderStatus.FINISHED,
			};

			const confirmation = window.confirm('Have you received your order?');
			if (confirmation) {
				await orderService.updateOrder(input);
				setValue(OrderStatus.FINISHED);
				setOrderBuilder(new Date());
			}
		} catch (err) {
			console.log(err);
			sweetErrorHandling(err).then();
		}
	};

	const cancelOrderHandler = async (e: T) => {
		try {
			if (!authMember) throw Error(Messages.error2);

			const orderId = e.target.value;
			const input: OrderUpdateInput = {
				_id: orderId,
				orderStatus: OrderStatus.CANCELLED,
			};

			const confirmation = window.confirm('Do you want to cancel this order?');
			if (confirmation) {
				await orderService.updateOrder(input);
				setValue(OrderStatus.CANCELLED);
				setOrderBuilder(new Date());
			}
		} catch (err) {
			console.log(err);
			sweetErrorHandling(err).then();
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
							<Tab label={'All '} value={'ALL'} />
							<Tab label={'Paused'} value={OrderStatus.PAUSED} />
							<Tab label={'Processing'} value={OrderStatus.PROCESSING} />
							<Tab label={'Completed'} value={OrderStatus.FINISHED} />
						</Tabs>
					</Stack>

					{/* ALL */}
					<TabPanel value={'ALL'} className="order-tab-panel">
						<AllOrders
							deleteOrderHandler={deleteOrderHandler}
							processOrderHandler={processOrderHandler}
							finishOrderHandler={finishOrderHandler}
							cancelOrderHandler={cancelOrderHandler}
						/>
					</TabPanel>

					{/* PAUSED */}
					<TabPanel value={OrderStatus.PAUSED} className="order-tab-panel">
						<PausedOrders deleteOrderHandler={deleteOrderHandler} processOrderHandler={processOrderHandler} />
					</TabPanel>

					{/* PROCESSING */}
					<TabPanel value={OrderStatus.PROCESSING} className="order-tab-panel">
						<ProcessOrders finishOrderHandler={finishOrderHandler} />
					</TabPanel>

					{/* FINISHED */}
					<TabPanel value={OrderStatus.FINISHED} className="order-tab-panel">
						<FinishedOrders deleteOrderHandler={deleteOrderHandler} cancelOrderHandler={cancelOrderHandler} />
					</TabPanel>
				</TabContext>
			</Container>
		</div>
	);
}
