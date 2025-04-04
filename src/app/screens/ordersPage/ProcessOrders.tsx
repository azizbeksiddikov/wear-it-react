import React from 'react';
import { Typography, Stack } from '@mui/material';
import OrderCard from './OrderCard';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { retrieverProcessedOrders } from './selector';
import { T } from '../../../libs/types/common';

const processedOrdersRetriever = createSelector(retrieverProcessedOrders, (processOrders) => ({ processOrders }));

interface ProcessedOrdersProps {
	finishOrderHandler: (e: T) => {};
}

export default function ProcessOrders(props: ProcessedOrdersProps) {
	const { processOrders } = useSelector(processedOrdersRetriever);
	const { finishOrderHandler } = props;

	return (
		<>
			<Stack className="orders-container">
				{processOrders.map((order) => (
					<Stack key={order._id} className={`order-wrapper `}>
						<OrderCard order={order} finishOrderHandler={finishOrderHandler} />
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
