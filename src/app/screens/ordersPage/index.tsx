import React, { useEffect } from 'react';
import { Container, Typography, Stack } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import { useState, SyntheticEvent } from 'react';
import TabPanel from '@mui/lab/TabPanel';
import { Order, OrderInquiry } from '../../../libs/types/order';
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
	const { authMember, orderBuilder } = useGlobals();
	if (!authMember) history.push('/');

	const { setAllOrders, setPausedOrders, setProcessOrders, setFinishedOrders } = actionDispatch(useDispatch());

	const [value, setValue] = useState<string>(OrderStatus.PAUSED);
	const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
		page: 1,
		limit: 8,
		orderStatus: OrderStatus.PAUSED,
	});

	useEffect(() => {
		const order = new OrderService();
		// Get All Orders
		order
			.getMyOrders({
				...orderInquiry,
				orderStatus: undefined,
			})
			.then((data) => setAllOrders(data))
			.catch((err) => console.log(err));

		// Get Paused Orders
		order
			.getMyOrders({
				...orderInquiry,
				orderStatus: OrderStatus.PAUSED,
			})
			.then((data) => setPausedOrders(data))
			.catch((err) => console.log(err));

		// Get Processing Orders
		order
			.getMyOrders({
				...orderInquiry,
				orderStatus: OrderStatus.PROCESSING,
			})
			.then((data) => setProcessOrders(data))
			.catch((err) => console.log(err));

		// Get Finished Orders
		order
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
					<TabPanel value={'ALL'} className="order-tab-panel">
						<AllOrders setValue={setValue} />
					</TabPanel>

					{/* PAUSED */}
					<TabPanel value={OrderStatus.PAUSED} className="order-tab-panel">
						<PausedOrders setValue={setValue} />
					</TabPanel>

					{/* PROCESSING */}
					<TabPanel value={OrderStatus.PROCESSING} className="order-tab-panel">
						<ProcessOrders setValue={setValue} />
					</TabPanel>

					{/* FINISHED */}
					<TabPanel value={OrderStatus.FINISHED} className="order-tab-panel">
						<FinishedOrders />
					</TabPanel>
				</TabContext>
			</Container>
		</div>
	);
}
