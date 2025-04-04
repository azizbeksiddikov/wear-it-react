import React from 'react';
import { Typography, Button, Stack } from '@mui/material';
import OrderCard from './OrderCard';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { retrieverProcessedOrders } from './selector';

const processedOrdersRetriever = createSelector(retrieverProcessedOrders, (processOrders) => ({ processOrders }));

export default function ProcessOrders() {
	const { processOrders } = useSelector(processedOrdersRetriever);

	return (
		<>
			<Stack className="orders-container">
				{processOrders.map((order) => (
					<Stack key={order._id} className={`order-wrapper `}>
						<OrderCard order={order} />
					</Stack>
				))}
			</Stack>

			{processOrders.length === 0 && (
				<Stack className="empty-orders">
					<Typography variant="body1" className="pinterest-text-secondary">
						You don't have any orders to display.
					</Typography>
				</Stack>
			)}
		</>
	);
}
