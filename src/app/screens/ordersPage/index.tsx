import React, { useEffect, useRef } from 'react';
import { useState, SyntheticEvent } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { setPausedOrders, setProcessOrders, setFinishedOrders, setAllOrders } from './slice';
import { useGlobals } from '../../hooks/useGlobals';
import { useHistory } from 'react-router-dom';

import { Container, Typography, Stack } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';

import PausedOrders from './PausedOrders';
import ProcessOrders from './ProcessOrders';
import FinishedOrders from './FinishedOrders';
import AllOrders from './AllOrders';

import { Order, OrderInquiry } from '../../../libs/types/order';
import { OrderStatus } from '../../../libs/enums/order.enum';
import OrderService from '../../services/OrderService';

import '../../../css/ordersPage/order.css';
import '../../../css/ordersPage/orders.css';

const actionDispatch = (dispatch: Dispatch) => ({
	setAllOrders: (data: Order[]) => dispatch(setAllOrders(data)),
	setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
	setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
	setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

export default function OrdersPage() {
	const history = useHistory();
	const { authMember, orderBuilder } = useGlobals();
	if (!authMember) history.push('/');
	const { setAllOrders, setPausedOrders, setProcessOrders, setFinishedOrders } = actionDispatch(useDispatch());
	const [value, setValue] = useState<string>('ALL');
	const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
		page: 1,
		limit: 10,
		orderStatus: OrderStatus.PAUSED,
	});

	const orderService = new OrderService();

	useEffect(() => {
		// All Orders
		orderService
			.getMyOrders({
				...orderInquiry,
				orderStatus: undefined,
			})
			.then((data) => setAllOrders(data))
			.catch((err) => console.log(err));

		// Paused Orders
		orderService
			.getMyOrders({
				...orderInquiry,
				orderStatus: OrderStatus.PAUSED,
			})
			.then((data) => setPausedOrders(data))
			.catch((err) => console.log(err));

		// Processing Orders
		orderService
			.getMyOrders({
				...orderInquiry,
				orderStatus: OrderStatus.PROCESSING,
			})
			.then((data) => setProcessOrders(data))
			.catch((err) => console.log(err));

		// Finished Orders
		orderService
			.getMyOrders({
				...orderInquiry,
				orderStatus: OrderStatus.FINISHED,
			})
			.then((data) => setFinishedOrders(data))
			.catch((err) => console.log(err));
	}, [orderInquiry, orderBuilder]);

	/** HANDLERS */
	const handleChange = (event: SyntheticEvent, newValue: string) => {
		setValue(newValue);
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
					<Stack>
						<AllOrders setValue={setValue} />
						<PausedOrders setValue={setValue} />
						<ProcessOrders setValue={setValue} />
						<FinishedOrders setValue={setValue} />
					</Stack>
				</TabContext>
			</Container>
		</div>
	);
}
