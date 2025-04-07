import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import OrderCard from './OrderCard';
import TabPanel from '@mui/lab/TabPanel';
import { OrderStatus } from '../../../libs/enums/order.enum';
import { createSelector } from '@reduxjs/toolkit';
import { retrieverPausedOrders } from './selector';
import { useSelector } from 'react-redux';

const pausedOrdersRetriever = createSelector(retrieverPausedOrders, (pausedOrders) => ({ pausedOrders }));

interface PausedOrdersProps {
	setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
	const { pausedOrders } = useSelector(pausedOrdersRetriever);
	const { setValue } = props;

	return (
		<TabPanel value={OrderStatus.PAUSED} className="orders-tab-panel">
			<Stack className="orders-container">
				{pausedOrders.map((order) => (
					<Box key={order._id} className="order-wrapper">
						<OrderCard order={order} setValue={setValue} />
					</Box>
				))}

				{pausedOrders.length === 0 && (
					<Stack className="empty-orders">
						<Typography variant="body1" className="pinterest-text-secondary">
							You don't have any orders to display.
						</Typography>
					</Stack>
				)}
			</Stack>
		</TabPanel>
	);
}
