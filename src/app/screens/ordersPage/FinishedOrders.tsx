import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import OrderCard from './OrderCard';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { retrieverFinishedOrders } from './selector';

const finishedOrdersRetriever = createSelector(retrieverFinishedOrders, (finishedOrders) => ({ finishedOrders }));

export default function FinishedOrders() {
	const { finishedOrders } = useSelector(finishedOrdersRetriever);

	return (
		<>
			<Stack className="orders-container">
				{finishedOrders.map((order) => (
					<Box key={order._id} className={'order-wrapper pinterest-card'}>
						<OrderCard order={order} />
					</Box>
				))}
			</Stack>

			{finishedOrders.length === 0 && (
				<Stack className="empty-orders">
					<Typography variant="body1" className="pinterest-text-secondary">
						You don't have any orders to display.
					</Typography>
				</Stack>
			)}
		</>
	);
}
