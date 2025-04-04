import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import OrderCard from './OrderCard';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { retrieverPausedOrders } from './selector';

const pausedOrdersRetriever = createSelector(retrieverPausedOrders, (pausedOrders) => ({ pausedOrders }));

export default function PausedOrders() {
	const { pausedOrders } = useSelector(pausedOrdersRetriever);

	return (
		<>
			<Stack className="orders-container">
				{pausedOrders.map((order) => (
					<Box key={order._id} className="order-wrapper">
						<OrderCard order={order} />
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
		</>
	);
}
