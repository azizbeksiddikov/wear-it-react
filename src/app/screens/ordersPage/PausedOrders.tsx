import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import OrderCard from './OrderCard';
import { T } from '../../../libs/types/common';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { retrieverPausedOrders } from './selector';

const pausedOrdersRetriever = createSelector(retrieverPausedOrders, (pausedOrders) => ({ pausedOrders }));

interface PausedOrdersProps {
	deleteOrderHandler: (e: T) => {};
	processOrderHandler: (e: T) => {};
}

export default function PausedOrders(props: PausedOrdersProps) {
	const { deleteOrderHandler, processOrderHandler } = props;

	const { pausedOrders } = useSelector(pausedOrdersRetriever);

	return (
		<>
			<Stack className="orders-container">
				{pausedOrders.map((order) => (
					<Box key={order._id} className="order-wrapper">
						<OrderCard
							order={order}
							deleteOrderHandler={deleteOrderHandler}
							processOrderHandler={processOrderHandler}
						/>
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
